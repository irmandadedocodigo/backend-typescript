import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  register(registerDto: RegisterDto) {
    return this.userRepository.insert(this.userRepository.create(registerDto));
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findUserToLoginByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });
  }

  sendPasswordResetLink(user: User, token: string) {
    return this.mailService.sendPasswordResetLink(user, token);
  }
}
