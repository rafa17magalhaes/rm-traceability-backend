import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDTO } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDTO): Promise<Event> {
    return this.eventService.create(dto);
  }

  @Get()
  findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get('/by-code')
  findByCodeId(@Query('codeId') codeId: string): Promise<Event[]> {
    return this.eventService.findByCodeId(codeId);
  }

  @Get('/by-status')
  findByStatusId(@Query('statusId') statusId: string): Promise<Event[]> {
    return this.eventService.findByStatusId(statusId);
  }
}
