import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CompaniesService } from './services/companies.service';
import { CompaniesController } from './controllers/companies.controller';
import { Company } from './entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
  ],
  providers: [
    CompaniesService,
    {
      provide: 'CompanyRepository',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Company).extend({
          async findActiveCompanies() {
            return this.find({ where: { active: true } });
          },
        }),
      inject: [DataSource],
    },
  ],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {}
