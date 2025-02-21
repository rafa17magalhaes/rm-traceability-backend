import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { StatusService } from '../services/status.service';
import { CreateStatusDTO } from '../dtos/create-status.dto';
import { UpdateStatusDTO } from '../dtos/update-status.dto';
import { Status } from '../entities/status.entity';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create(@Body() createStatusDto: CreateStatusDTO): Promise<Status> {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }

  @Get('active')
  findActive(): Promise<Status[]> {
    return this.statusService.findActive();
  }

  @Get('by-name/:name')
  findByName(
    @Param('name') name: string,
    @Query('companyId') companyId?: string,
  ): Promise<Status> {
    return this.statusService.findByName(name, companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Status> {
    return this.statusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDTO,
  ): Promise<Status> {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.statusService.remove(id);
  }
}
