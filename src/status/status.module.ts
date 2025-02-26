import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Status } from './entities/status.entity';
import { StatusService } from './services/status.service';
import { StatusController } from './controllers/status.controller';
import { StatusRepository } from './repositories/status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusController],
  providers: [
    StatusService,
    {
      provide: 'StatusRepository',
      useFactory: (dataSource: DataSource) => {
        return new StatusRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [StatusService, 'StatusRepository'],
})
export class StatusModule {}
