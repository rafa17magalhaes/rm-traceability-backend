import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export type UserRepositoryType = Repository<User> & {
  findActive(): Promise<User[]>;
};
