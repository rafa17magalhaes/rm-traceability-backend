import { DataSource, Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

export class EventRepository extends Repository<Event> {
  constructor(dataSource: DataSource) {
    super(Event, dataSource.createEntityManager());
  }

  async findByCodeId(codeId: string): Promise<Event[]> {
    return this.find({ where: { codeId } });
  }

  async findByStatusId(statusId: string): Promise<Event[]> {
    return this.find({ where: { statusId } });
  }
}
