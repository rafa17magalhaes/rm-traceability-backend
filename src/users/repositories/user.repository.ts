import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export class UserRepository extends Repository<User> {
  async findActive(): Promise<User[]> {
    return this.find({ where: { active: true } });
  }
}
