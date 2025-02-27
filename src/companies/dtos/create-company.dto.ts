export class CreateCompanyDTO {
  code: string;
  document: string;
  name: string;
  trade: string;
  municipalRegistration?: string;
  stateRegistration?: string;
  active?: boolean;
  zipCode?: string;
  street?: string;
  complement?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
}
