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
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async create(@Body() loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email, true);
    if (!user) throw new NotFoundException();

    if (!user.comparePassword(loginDto.password))
      throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
