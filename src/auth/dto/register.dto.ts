import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { PasswordConfirmationDto } from './passwordConfirmation.dto';

export class RegisterDto extends PasswordConfirmationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;
}
