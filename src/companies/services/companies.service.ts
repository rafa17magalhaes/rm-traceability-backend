import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { CreateCompanyDTO } from '../dtos/create-company.dto';
import { UpdateCompanyDTO } from '../dtos/update-company.dto';
import { CompanyRepositoryType } from '../interfaces/companies-repository.type';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepositoryType,
  ) {}

  async create(CreateCompanyDTO: CreateCompanyDTO): Promise<Company> {
    const company = this.companyRepository.create(CreateCompanyDTO);
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
    return company;
  }

  async update(
    id: string,
    UpdateCompanyDTO: UpdateCompanyDTO,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, UpdateCompanyDTO);
    return this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
  }

  async findActiveCompanies(): Promise<Company[]> {
    return this.companyRepository.findActiveCompanies();
  }
}
