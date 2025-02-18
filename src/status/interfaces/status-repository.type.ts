import { Repository } from 'typeorm';
import { Status } from '../entities/status.entity';

export type StatusRepositoryType = Repository<Status> & {
  findActiveStatuses(): Promise<Status[]>;
};
