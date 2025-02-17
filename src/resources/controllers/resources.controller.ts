import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { Resource } from '../entities/resource.entity';
import { CreateResourceDTO } from '../dtos/create-resource.dto';
import { UpdateResourceDTO } from '../dtos/update-resource.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpressUserRequest, UserPayload } from 'src/auth/types/ExpressUserRequest';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo recurso' })
  @ApiResponse({ status: 201, description: 'Recurso criado com sucesso.', type: Resource })
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateResourceDTO, @Req() request: ExpressUserRequest): Promise<Resource> {
    const user = request.user as UserPayload;
    const companyId = user.companyId;
    return this.resourcesService.create({ ...dto, companyId });
  }
  
  @Get()
  @ApiOperation({ summary: 'Listar todos os recursos' })
  @ApiResponse({ status: 200, description: 'Lista de recursos.', type: [Resource] })
  findAll(): Promise<Resource[]> {
    return this.resourcesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar recursos ativos' })
  @ApiResponse({ status: 200, description: 'Lista de recursos ativos.', type: [Resource] })
  findActive(): Promise<Resource[]> {
    return this.resourcesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um recurso por ID' })
  @ApiResponse({ status: 200, description: 'Recurso encontrado.', type: Resource })
  findOne(@Param('id') id: string): Promise<Resource> {
    return this.resourcesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um recurso existente' })
  @ApiResponse({ status: 200, description: 'Recurso atualizado com sucesso.', type: Resource })
  update(@Param('id') id: string, @Body() dto: UpdateResourceDTO): Promise<Resource> {
    return this.resourcesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um recurso existente' })
  @ApiResponse({ status: 200, description: 'Recurso deletado com sucesso.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.resourcesService.remove(id);
  }
}
