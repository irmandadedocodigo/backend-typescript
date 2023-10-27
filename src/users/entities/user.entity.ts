import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { BaseEntity } from 'src/common/baseEntity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.usersLikes)
  likedPosts: Post[];

  @BeforeInsert()
  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
  }

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
