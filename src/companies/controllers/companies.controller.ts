import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CompaniesService } from '../services/companies.service';
import { Company } from '../entities/company.entity';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
import { UpdateCompanyDTO } from '../dtos/update-company.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso.', type: Company })
  create(@Body() createCompanyDTO: CreateCompanyDTO): Promise<Company> {
    return this.companiesService.create(createCompanyDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas.', type: [Company] })
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada.', type: Company })
  findOne(@Param('id') id: string): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma empresa existente' })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso.', type: Company })
  update(@Param('id') id: string, @Body() updateCompanyDTO: UpdateCompanyDTO): Promise<Company> {
    return this.companiesService.update(id, updateCompanyDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma empresa existente' })
  @ApiResponse({ status: 200, description: 'Empresa deletada com sucesso.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.companiesService.remove(id);
  }
}
