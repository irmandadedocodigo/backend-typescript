import { Injectable } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: string) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: string, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
