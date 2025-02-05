import { Repository } from 'typeorm';
import { ActiveToken } from '../entities/active-token.entity';

export type ActiveTokenRepositoryType = Repository<ActiveToken> & {
  findByCode(code: string): Promise<ActiveToken | null>;
  findValidToken(code: string): Promise<ActiveToken | null>;
  createToken(userId: string): Promise<ActiveToken>;
  markAsUsed(token: ActiveToken): Promise<ActiveToken>;
};
