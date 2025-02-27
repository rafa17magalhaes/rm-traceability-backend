import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { EventRepositoryType } from '../interfaces/event-repository.type';
import { CreateEventDTO } from '../dtos/create-event.dto';

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

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['status', 'company', 'resource', 'user', 'code'],
    });
  }

  async findByCodeId(codeId: string): Promise<Event[]> {
    return this.eventRepository.findByCodeId(codeId);
  }

  async findByStatusId(statusId: string): Promise<Event[]> {
    return this.eventRepository.findByStatusId(statusId);
  }
}
