import { DataSource, Repository } from 'typeorm';
import { Code } from '../entities/code.entity';

export class CodeRepository extends Repository<Code> {
  constructor(dataSource: DataSource) {
    super(Code, dataSource.createEntityManager());
  }

  async findByValue(value: string): Promise<Code | null> {
    return this.findOne({ where: { value } });
  }
}
