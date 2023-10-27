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

  async findUserByEmail(email: string, selectPassword: boolean = false) {
    return await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: selectPassword,
      },
    });
  }

  async findById(id: string, selectPassword: boolean = false) {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: selectPassword,
      },
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.insert(
      this.userRepository.create(createUserDto),
    );
  }

  async findAllUserPostsByUserId(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts'],
    });

    return user.posts;
  }

  async update(user: User) {
    return this.userRepository.save(user);
  }
}
