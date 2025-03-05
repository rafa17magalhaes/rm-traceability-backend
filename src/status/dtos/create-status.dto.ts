export class CreateStatusDTO {
  name: string;
  description?: string;
  active?: boolean;
  companyId?: string | undefined;
  resourceId?: string;
  createdAt?: string;
  updatedAt?: string;
}
