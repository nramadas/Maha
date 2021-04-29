import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

import { Role } from '../entities/Role';
import { User } from '../entities/User';

@Entity()
@Unique(['name'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'jsonb' })
  data!: object;

  @OneToMany('User', 'organization')
  users!: User[];

  @OneToMany('Role', 'organization')
  roles!: Role[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
