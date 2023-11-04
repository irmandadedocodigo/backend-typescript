import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { Token } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async create(userId: string, type: string, expiresAt: Date) {
    const randomToken = randomBytes(64).toString('hex');

    const token = this.tokenRepository.create({
      userId,
      token: randomToken,
      type,
      expiresAt: expiresAt.toISOString(),
    });

    return await this.tokenRepository.save(token);
  }

  async findByToken(token: string) {
    return await this.tokenRepository.findOne({ where: { token } });
  }

  async remove(token: Token) {
    return await this.tokenRepository.remove(token);
  }
}
