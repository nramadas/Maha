import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Invite } from '../entities/Invite';
import { Organization } from '../entities/Organization';
import { User } from '../entities/User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  organizationId!: string;

  @ManyToOne('Organization', 'roles')
  organization!: Organization;

  @ManyToMany('Invite', 'roles')
  invites!: Invite[];

  @ManyToMany('User', 'roles')
  @JoinTable()
  users!: User[];

  @Column({ type: 'jsonb' })
  data!: object;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
