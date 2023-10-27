import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id/posts')
  findAllUserPostsByUserId(@Param('id') id: string) {
    return this.usersService.findAllUserPostsByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Patch('update/password')
  async updatePassword(
    @Request() req,
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

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }
}
