export class CreateUserDTO {
    name: string;
    email: string;
    phone: string;
    active?: boolean;
    password: string;
    companyId?: string;
  }
  