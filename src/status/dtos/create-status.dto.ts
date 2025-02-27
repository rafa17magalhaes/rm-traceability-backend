export class CreateStatusDTO {
  name: string;
  description?: string;
  active?: boolean;
  companyId: string;
  resourceId?: string;
  createdAt?: string;
  updatedAt?: string;
}
