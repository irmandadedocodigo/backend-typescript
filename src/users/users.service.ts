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
      relations: ['followers', 'following'],
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

  async followUser(user: User, userToFollow: User) {
    user.following.push(userToFollow);

    await this.userRepository.save(user);
  }

  async unfollowUser(user: User, userToUnfollow: User) {
    user.following = user.following.filter(
      (user) => user.id !== userToUnfollow.id,
    );

    await this.userRepository.save(user);
  }
}
