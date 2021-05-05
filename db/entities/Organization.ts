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

import { Data } from '../../models/Organization';
import { Property } from '../entities/Property';
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
  data!: Partial<Data>;

  @OneToMany('User', 'organization')
  users!: User[];

  @OneToMany('Role', 'organization')
  roles!: Role[];

  @OneToMany('Property', 'organization')
  properties!: Property[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
