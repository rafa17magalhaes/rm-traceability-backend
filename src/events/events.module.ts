import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: 'EventRepository',
      useFactory: (dataSource: DataSource) => new EventRepository(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [EventService, 'EventRepository'],
})
export class EventModule {}
