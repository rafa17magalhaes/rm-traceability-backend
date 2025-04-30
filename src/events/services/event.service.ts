import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { EventRepositoryType } from '../interfaces/event-repository.type';
import { CreateEventDTO } from '../dtos/create-event.dto';
import SearchQuery from 'src/shared/query/SearchQuery';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';

@Injectable()
export class EventService {
  constructor(
    @Inject('EventRepository')
    private readonly eventRepository: EventRepositoryType,
  ) {}

  async create(dto: CreateEventDTO): Promise<Event> {
    const event = this.eventRepository.create(dto);
    return this.eventRepository.save(event);
  }

  async findAll(
    queryParams: Partial<{
      page: number;
      search: string;
      sort: string;
      size: number;
    }>,
  ): Promise<PaginationDTO<Event>> {
    const searchQuery = SearchQuery.build().from(queryParams);

    const qb = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.status', 'status')
      .leftJoinAndSelect('event.company', 'company')
      .leftJoinAndSelect('event.resource', 'resource')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.code', 'code')
      .leftJoinAndSelect('code.resource', 'codeResource');

    // Filtros dinâmicos (searchQuery)
    searchQuery.params.forEach((criteria, index) => {
      const paramName = `param${index}`;
      if (criteria.operator === ':') {
        qb.andWhere(`event.${criteria.key} = :${paramName}`, {
          [paramName]: criteria.value,
        });
      } else if (criteria.operator === '>') {
        qb.andWhere(`event.${criteria.key} > :${paramName}`, {
          [paramName]: criteria.value,
        });
      } else if (criteria.operator === '<') {
        qb.andWhere(`event.${criteria.key} < :${paramName}`, {
          [paramName]: criteria.value,
        });
      }
    });

    // Ordenação
    if (searchQuery.sort.length > 0) {
      searchQuery.sort.forEach((sortStr) => {
        const [key, order] = sortStr.split(':');
        qb.addOrderBy(`event.${key}`, order as 'ASC' | 'DESC');
      });
    } else {
      qb.addOrderBy('event.createdAt', 'DESC');
    }

    // Paginação
    qb.skip((searchQuery.page - 1) * searchQuery.size).take(searchQuery.size);

    const [data, total] = await qb.getManyAndCount();

    data.forEach((event) => {
      // Ajuste se precisar setar resourceId a partir do code.resourceId
      if (event.code?.resourceId) {
        event.resourceId = event.code.resourceId;
      }
    });

    return {
      data,
      total,
      page: searchQuery.page,
      size: searchQuery.size,
    };
  }

  async findByCodeId(codeId: string): Promise<Event[]> {
    return this.eventRepository.findByCodeId(codeId);
  }

  async findByStatusId(statusId: string): Promise<Event[]> {
    return this.eventRepository.findByStatusId(statusId);
  }

  // Contagem de eventos não lidos
  async getUnreadCount(): Promise<number> {
    return this.eventRepository.count({
      where: { isRead: false },
    });
  }

  // Método para marcar como lido
  async markAsRead(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Evento ${eventId} não encontrado`);
    }
    // Seta como lido e salva no banco
    event.isRead = true;
    return this.eventRepository.save(event);
  }
}
