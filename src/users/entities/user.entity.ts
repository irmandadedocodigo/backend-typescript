import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
  }
}
