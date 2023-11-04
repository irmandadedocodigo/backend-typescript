import { IsNotEmpty, IsString } from 'class-validator';
import { PasswordConfirmationDto } from './passwordConfirmation.dto';

export class ResetPasswordDto extends PasswordConfirmationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
