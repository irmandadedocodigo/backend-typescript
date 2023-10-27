import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  createdAt: string;

  @Column({ nullable: false })
  updatedAt: string;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date().toISOString();
  }

  @BeforeInsert()
  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date().toISOString();
  }
}
