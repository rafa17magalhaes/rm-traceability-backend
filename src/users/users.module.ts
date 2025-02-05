import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { ActiveToken } from './entities/active-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ActiveToken]),
  ],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(User).extend({
          async findActive(this: any) {
            return this.find({ where: { active: true } });
          },
        }),
      inject: [DataSource],
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
