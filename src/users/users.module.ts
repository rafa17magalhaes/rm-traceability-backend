import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { addDays } from 'date-fns';
import * as crypto from 'crypto';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { ActiveTokensService } from './services/active-tokens.service';
import { ActiveTokensController } from './controllers/active-tokens.controller';
import { User } from './entities/user.entity';
import { ActiveToken } from './entities/active-token.entity';

@Module({
  imports: [
    // Registra as entidades para que os repositórios padrão sejam criados
    TypeOrmModule.forFeature([User, ActiveToken]),
  ],
  providers: [
    UsersService,
    ActiveTokensService,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(User).extend({
          async findActive() {
            return this.find({ where: { active: true } });
          },
        }),
      inject: [DataSource],
    },
    {
      provide: 'ActiveTokenRepository',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ActiveToken).extend({
          async findByCode(code: string): Promise<ActiveToken | null> {
            const token = await this.findOne({
              where: { code },
              relations: ['user'],
            });
            return token ?? null;
          },
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
          },
          async createToken(userId: string): Promise<ActiveToken> {
            const token = this.create({
              userId,
              code: crypto.randomBytes(5).toString('hex'),
              expires: addDays(new Date(), 1),
              used: false,
            });
            return this.save(token);
          },
          async markAsUsed(token: ActiveToken): Promise<ActiveToken> {
            token.used = true;
            return this.save(token);
          },
        }),
      inject: [DataSource],
    },
  ],
  controllers: [UsersController, ActiveTokensController],
  exports: [UsersService, ActiveTokensService],
})
export class UsersModule {}
