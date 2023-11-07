import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetLink(user: User, url: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: './forgotPassword.hbs',
      context: {
        url,
      },
    });
  }
}
