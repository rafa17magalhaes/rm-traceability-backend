import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() CreateUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(CreateUserDTO);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() UpdateUserDTO: UpdateUserDTO): Promise<User> {
    return this.usersService.update(id, UpdateUserDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
