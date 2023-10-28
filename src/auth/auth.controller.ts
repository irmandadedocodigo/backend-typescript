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
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private jwtService: JwtService,
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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: IRequestWithUser) {
    return this.usersService.findById(req.user.sub);
  }
}
