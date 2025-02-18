import { DataSource, Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';

export class ResourceRepository extends Repository<Resource> {
  constructor(dataSource: DataSource) {
    super(Resource, dataSource.createEntityManager());
  }

  async findActiveResources(): Promise<Resource[]> {
    return this.find({ where: { active: true } });
  }
}
