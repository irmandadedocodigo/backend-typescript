import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Match } from 'src/common/validations/decorators/match.decorator';

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  password: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;

  @Match('newPassword', {
    message: 'New password confirmation must match password',
  })
  newPasswordConfirmation: string;
}
