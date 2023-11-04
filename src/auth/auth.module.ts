import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { TokensService } from 'src/tokens/tokens.service';
import { Token } from 'src/tokens/entities/token.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, TokensService],
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '28800s' },
        global: true,
      }),
    }),
    MailModule,
    TokensModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
