import { Request } from 'express';

export interface UserPayload {
  companyId: string;
}

export interface ExpressUserRequest extends Request {
  user?: UserPayload;
}
