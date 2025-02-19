import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

export type EventRepositoryType = Repository<Event> & {
  findByCodeId(codeId: string): Promise<Event[]>;
  findByStatusId(statusId: string): Promise<Event[]>;
};
