import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
