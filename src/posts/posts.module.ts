import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService],
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule],
})
export class PostsModule {}
