import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDTO } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';
import { QueryParams } from 'src/shared/query/GenericQueryList';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDTO): Promise<Event> {
    return this.eventService.create(dto);
  }

  @Get()
  async findAll(@Query() query: QueryParams): Promise<PaginationDTO<Event>> {
    const convertedQuery = {
      page: query.page ? Number(query.page) : 1,
      search: query.search || '',
      sort: query.sort || '',
      size: query.size ? Number(query.size) : 20,
    };
    return this.eventService.findAll(convertedQuery);
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
