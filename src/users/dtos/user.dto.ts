import { CreateCompanyDTO } from 'src/companies/dtos/create-company.dto';

export class UserDTO {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  active?: boolean;
  password: string;
  companyId?: string | null;
  company?: CreateCompanyDTO;
  createdAt?: string;
  updatedAt?: string;
}
