import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
