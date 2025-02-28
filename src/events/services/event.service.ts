import { Injectable } from '@nestjs/common';
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
      .leftJoinAndSelect('event.code', 'code');

    // Aplica os filtros dinâmicos baseados nos parâmetros de SearchQuery
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

    if (searchQuery.sort.length > 0) {
      searchQuery.sort.forEach((sortStr) => {
        const [key, order] = sortStr.split(':');
        qb.addOrderBy(`event.${key}`, order as 'ASC' | 'DESC');
      });
    } else {
      qb.addOrderBy('event.createdAt', 'DESC');
    }
    // Aplica paginação
    qb.skip((searchQuery.page - 1) * searchQuery.size).take(searchQuery.size);

    const [data, total] = await qb.getManyAndCount();
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
}
