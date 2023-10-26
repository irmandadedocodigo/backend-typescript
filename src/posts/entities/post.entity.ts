import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  usersLikes: User[];
}
