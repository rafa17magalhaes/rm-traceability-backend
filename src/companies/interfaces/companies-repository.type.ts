import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

export type CompanyRepositoryType = Repository<Company> & {
  findActiveCompanies(): Promise<Company[]>;
};
