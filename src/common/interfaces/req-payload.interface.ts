import { Request } from 'express';

export interface ReqPayload extends Request {
  user: {
    id: string;
    username: string;
    email: string;
  };
}
