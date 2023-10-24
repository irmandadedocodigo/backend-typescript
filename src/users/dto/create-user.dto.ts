import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
