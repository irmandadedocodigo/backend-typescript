import {
  Controller,
  Post,
  Body,
  Request,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  HttpCode,
  Get,
  UseGuards,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { SendPasswordResetLinkDto } from './dto/sendPasswordResetLink.dto';
import { UsersService } from 'src/users/users.service';
import { IRequestWithUser } from 'src/common/interfaces/request';
import { TokensService } from 'src/tokens/tokens.service';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const checkEmailUser = await this.authService.findUserByEmail(
      registerDto.email,
    );

    if (checkEmailUser) {
      throw new UnprocessableEntityException('Email is already taken');
    }

    return await this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async create(@Body() loginDto: LoginDto) {
    const user = await this.authService.findUserToLoginByEmail(loginDto.email);
    if (!user) throw new NotFoundException();

    if (!user.comparePassword(loginDto.password))
      throw new UnauthorizedException();

    const payload = { sub: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async sendPasswordResetLink(@Body() { email }: SendPasswordResetLinkDto) {
    const user = await this.authService.findUserByEmail(email);

    if (!user) return;

    const token = await this.tokensService.create(
      user.id,
      'password-reset',
      new Date(Date.now() + 1000 * 60 * 30),
    );

    const url = `${process.env.FRONT_URL}/auth/reset-password?token=${token.token}`;

    await this.mailService.sendPasswordResetLink(user, url);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    }

    const token = await this.tokensService.findByToken(resetPasswordDto.token);

    if (!token) throw new UnauthorizedException('Invalid token');
    if (new Date(token.expiresAt) < new Date())
      throw new UnauthorizedException('Token expired');

    const user = await this.usersService.findById(token.userId);

    user.password = resetPasswordDto.password;
    user.hashPassword();

    await this.usersService.update(user);

    await this.tokensService.remove(token);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: IRequestWithUser) {
    return this.usersService.findById(req.user.sub);
  }
}
