/* eslint-disable prettier/prettier */
import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { CompaniesService } from 'src/companies/services/companies.service';
import { UsersService } from 'src/users/services/users.service';
import { ResourcesService } from 'src/resources/services/resources.service';
import { StatusService } from 'src/status/services/status.service';
import { EventService } from 'src/events/services/event.service';
import { CodeService } from 'src/codes/services/code.service';

import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Resource } from 'src/resources/entities/resource.entity';
import { Status } from 'src/status/entities/status.entity';
import { Event } from 'src/events/entities/event.entity';
import { Code } from 'src/codes/entities/code.entity';
import PaginationDTO from 'src/shared/dtos/PaginationDTO';

@Controller('orchestration')
export class OrchestrationController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly resourcesService: ResourcesService,
    private readonly statusService: StatusService,
    private readonly eventService: EventService,
    private readonly codeService: CodeService,
  ) {}

  private normalizeString(str: string): string {
    return str
      .normalize('NFD') // decompõe em caractere base + acentos
      .replace(/[\u0300-\u036f]/g, '') // remove diacríticos (acentos)
      .toLowerCase();
  }
   // Retorna dados variados (usuário, empresa, resources, codes etc.)
  @Get('full-data/:userId')
  async getFullData(
    @Param('userId') userId: string,
  ): Promise<{
    user: User;
    company: Company | null;
    resources: Resource[];
    statuses: Status[];
    events: PaginationDTO<Event>;
    codes: PaginationDTO<Code>;
    inventoryCodes: PaginationDTO<Code> | null;
  }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Usuário com id ${userId} não encontrado`);
    }

    let company: Company | null = null;
    if (user.companyId) {
      company = await this.companiesService.findOne(user.companyId);
    }

    const resources = await this.resourcesService.findAll();

    const statuses = await this.statusService.findAll();

    const events = await this.eventService.findAll({
      page: 1,
      search: '',
      sort: '',
      size: 50,
    });

    const codes = await this.codeService.findAll({
      page: 1,
      search: '',
      sort: '',
      size: 50,
    });

    let inventoryCodes: PaginationDTO<Code> | null = null;
    if (user.companyId) {
      inventoryCodes = await this.codeService.findInventoryCodes(user.companyId, {
        page: 1,
        search: '',
        sort: '',
        size: 50,
      });
    }

    return {
      user,
      company,
      resources,
      statuses,
      events,
      codes,
      inventoryCodes,
    };
  }

   // Retorna a contagem de codes do tipo "inventário" para uma empresa e um recurso específico.
  @Get('inventory-quantity')
  async getInventoryQuantity(
    @Query('companyId') companyId: string,
    @Query('resourceName') resourceName: string,
  ): Promise<{ amount: number }> {
    if (!companyId || !companyId.trim()) {
      throw new NotFoundException('companyId não fornecido');
    }

    if (!resourceName || !resourceName.trim()) {
      throw new NotFoundException('resourceName não fornecido');
    }

    const resources = await this.resourcesService.findAll();

    const queryName = this.normalizeString(resourceName);

    const matchingResource = resources.find((r) => {
      const dbName = this.normalizeString(r.name); 
      return dbName === queryName;
    });

    if (!matchingResource) {
      return { amount: 0 };
    }

    const inventoryPaginated = await this.codeService.findInventoryCodes(companyId, {
      page: 1,
      size: 9999,
      search: `resourceId:${matchingResource.id}`,
      sort: '',
    });

    const amount = inventoryPaginated.total;
    return { amount };
  }
}
