// src/companies/companies.module.ts
import { Module } from '@nestjs/common';
import { CompaniesService } from './services/companies.service';
import { CompaniesController } from './controllers/companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './repositories/company.repository';

@Module({
    imports: [TypeOrmModule.forFeature([CompanyRepository])],
    controllers: [CompaniesController],
    providers: [CompaniesService],
    exports: [CompaniesService],
  })
  export class CompaniesModule {}
  
