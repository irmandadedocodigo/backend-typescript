import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request';
import { IdParamValidation } from 'src/common/validations/idParam.validation';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/posts')
  findAllUserPostsByUserId(@Param() { id }: IdParamValidation) {
    return this.usersService.findAllUserPostsByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get('posts/my')
  async findMyPosts(@Request() req: IRequestWithUser) {
    return await this.usersService.findAllUserPostsByUserId(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('update/password')
  async updatePassword(
    @Request() req: IRequestWithUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    if (
      updateUserPasswordDto.newPassword !==
      updateUserPasswordDto.newPasswordConfirmation
    ) {
      throw new UnprocessableEntityException('Passwords do not match');
    }

    const user = await this.usersService.findById(req.user.sub, true);

    if (!user.comparePassword(updateUserPasswordDto.password)) {
      throw new UnprocessableEntityException('Wrong password');
    }

    user.password = updateUserPasswordDto.newPassword;
    user.hashPassword();

    return this.usersService.update(user);
  }

  @UseGuards(AuthGuard)
  @Patch('follow/:id')
  async followUser(
    @Request() req: IRequestWithUser,
    @Param() { id }: IdParamValidation,
  ) {
    const user = await this.usersService.findById(req.user.sub);
    const userToFollow = await this.usersService.findById(id);

    await this.usersService.followUser(user, userToFollow);

    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('unfollow/:id')
  async unfollowUser(
    @Request() req: IRequestWithUser,
    @Param() { id }: IdParamValidation,
  ) {
    const user = await this.usersService.findById(req.user.sub);
    const userToUnfollow = await this.usersService.findById(id);

    await this.usersService.unfollowUser(user, userToUnfollow);

    return this.usersService.findById(req.user.sub);
  }
}
