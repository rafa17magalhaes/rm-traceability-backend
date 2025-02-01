import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../repositories/company.repository';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const {
      code,
      document,
      name,
      trade,
      municipalRegistration,
      stateRegistration,
      active,
      zipCode,
      street,
      complement,
      number,
      neighborhood,
      city,
      state,
    } = createCompanyDto;

    const company = this.companyRepository.create({
      code,
      document,
      name,
      trade,
      municipalRegistration,
      stateRegistration,
      active: active !== undefined ? active : true,
      zipCode,
      street,
      complement,
      number,
      neighborhood,
      city,
      state,
    });

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
  
  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);

    Object.assign(company, updateCompanyDto);

    return this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
  }
}
