import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.insert(
      this.userRepository.create(createUserDto),
    );
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
