import { EntityRepository, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {
  async findActiveCompanies(): Promise<Company[]> {
    return this.find({ where: { active: true } });
  }
}
  