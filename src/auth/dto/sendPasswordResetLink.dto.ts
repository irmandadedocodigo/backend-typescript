import { IsEmail } from 'class-validator';

export class SendPasswordResetLinkDto {
  @IsEmail()
  email: string;
}
