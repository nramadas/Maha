import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

import { Data } from '../../models/User';
import { Organization } from '../entities/Organization';
import { Role } from '../entities/Role';

@Entity()
@Unique(['email', 'googleId', 'appleId', 'authId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  googleId!: string;

  @Column({ nullable: true })
  appleId!: string;

  @Column()
  authId!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  organizationId?: string;

  @ManyToOne('Organization', 'users', { nullable: true })
  organization?: Organization | null;

  @ManyToMany('Role', 'users')
  roles!: Role[];

  @Column({ type: 'jsonb' })
  data!: Partial<Data>;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
