// user.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findActive(): Promise<User[]> {
    return this.find({ where: { active: true } });
  }
}
