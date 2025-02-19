import { Repository } from 'typeorm';
import { Code } from '../entities/code.entity';

export type CodeRepositoryType = Repository<Code> & {
  findByValue(value: string): Promise<Code | null>;
};
