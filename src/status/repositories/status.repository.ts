import { DataSource, Repository } from 'typeorm';
import { Status } from '../entities/status.entity';

export class StatusRepository extends Repository<Status> {
  constructor(dataSource: DataSource) {
    super(Status, dataSource.createEntityManager());
  }

  async findActiveStatuses(): Promise<Status[]> {
    return this.find({ where: { active: true } });
  }
}
