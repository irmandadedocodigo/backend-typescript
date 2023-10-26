import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(user: User, createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    post.user = user;

    return await this.postRepository.insert(post);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findById(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'usersLikes'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async update(post: Post, updatePostDto: UpdatePostDto) {
    return await this.postRepository.save({
      ...post,
      ...updatePostDto,
    });
  }

  async remove(post: Post) {
    return await this.postRepository.remove(post);
  }

  async likePost(post: Post, user: User) {
    post.usersLikes.push(user);

    return await this.postRepository.save(post);
  }
}
