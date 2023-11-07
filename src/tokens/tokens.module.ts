import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensService } from './tokens.service';
import { Token } from './entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
