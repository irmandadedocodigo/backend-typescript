import { IsUUID } from 'class-validator';

export class IdParamValidation {
  @IsUUID()
  id: string;
}
