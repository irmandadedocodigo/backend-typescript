import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    const user = await this.usersService.findById(req.user.id);

    return await this.postsService.create(user, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.findById(id);

    if (post.user.id !== req.user.sub) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    return await this.postsService.update(post, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Request() req) {
    const post = await this.postsService.findById(id);

    if (post.user.id !== req.user.sub) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }

    await this.postsService.remove(post);
  }

  @UseGuards(AuthGuard)
  @Post(':id/like')
  @HttpCode(204)
  async likePost(@Param('id') id: string, @Request() req) {
    const post = await this.postsService.findById(id);

    const user = await this.usersService.findById(req.user.id);

    await this.postsService.likePost(post, user);
  }

  @UseGuards(AuthGuard)
  @Post(':id/dislike')
  @HttpCode(204)
  async dislikePost(@Param('id') id: string, @Request() req) {
    const post = await this.postsService.findById(id);

    const user = await this.usersService.findById(req.user.id);

    await this.postsService.dislikePost(post, user);
  }
}
