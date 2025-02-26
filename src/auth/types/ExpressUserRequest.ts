import { Request } from 'express';

export interface UserPayload {
  id: string;
  companyId: string;
}

export interface ExpressUserRequest extends Request {
  user?: UserPayload;
}
