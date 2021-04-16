import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email', 'googleId', 'appleId', 'authId'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  googleId!: string;

  @Column({ nullable: true })
  appleId!: string;

  @Column()
  authId!: string;

  @Column()
  email!: string;

  @Column({ type: 'jsonb' })
  data!: object;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
