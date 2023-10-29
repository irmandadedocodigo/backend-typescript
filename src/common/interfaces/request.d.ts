import { Request } from '@nestjs/common';

export type IRequest = Request;

export interface IRequestWithUser extends IRequest {
  user: {
    sub: string;
    iat: number;
    exp: number;
  };
}
