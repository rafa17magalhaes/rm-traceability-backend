import { EntityRepository, Repository, MoreThanOrEqual } from 'typeorm';
import { ActiveToken } from '../entities/active-token.entity';
import * as crypto from 'crypto';
import { addDays } from 'date-fns';

@EntityRepository(ActiveToken)
export class ActiveTokenRepository extends Repository<ActiveToken> {
  async findByCode(code: string): Promise<ActiveToken | null> {
    const token = await this.findOne({
      where: { code },
      relations: ['user'],
    });
    return token ?? null;
  }

  async findValidToken(code: string): Promise<ActiveToken | null> {
    const token = await this.findOne({
      where: {
        code,
        used: false,
        expires: MoreThanOrEqual(new Date()),
      },
      relations: ['user'],
    });
    return token ?? null;
  }

  async createToken(userId: string): Promise<ActiveToken> {
    const token = this.create({
      userId,
      code: crypto.randomBytes(5).toString('hex'),
      expires: addDays(new Date(), 1),
      used: false,
    });
    return this.save(token);
  }

  async markAsUsed(token: ActiveToken): Promise<ActiveToken> {
    token.used = true;
    return this.save(token);
  }
}
