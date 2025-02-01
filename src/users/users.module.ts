import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repositories/user.repository';
import { ActiveTokenRepository } from './repositories/active-token.repository';
import { ActiveTokensService } from './services/active-tokens.service';
import { ActiveTokensController } from './controllers/active-tokens.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ActiveTokenRepository,
    ]),
  ],
  providers: [UsersService, ActiveTokensService],
  controllers: [UsersController, ActiveTokensController],
  exports: [UsersService, ActiveTokensService],
})
export class UsersModule {}
