import { BaseEntity } from 'src/common/baseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity('tokens')
export class Token extends BaseEntity {
  @Index({ unique: true })
  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  expiresAt: string;
}
