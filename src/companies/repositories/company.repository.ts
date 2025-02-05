import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

export const CompanyRepository = (Repository as any).extend({
  async findActiveCompanies(this: Repository<Company>): Promise<Company[]> {
    return this.find({ where: { active: true } });
  },
});
