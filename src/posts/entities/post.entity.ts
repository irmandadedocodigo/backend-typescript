import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/common/baseEntity';

@Entity('posts')
export class Post extends BaseEntity {
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
