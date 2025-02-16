import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';

export type ResourceRepositoryType = Repository<Resource> & {
  findActiveResources(): Promise<Resource[]>;
};
