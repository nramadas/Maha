import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { InviteType } from '../../models/InviteType';
import { Organization } from '../entities/Organization';
import { Role } from '../entities/Role';

@Entity()
@Unique(['email'])
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ default: false })
  expired!: boolean;

  @Column({
    type: 'enum',
    enum: InviteType,
    default: InviteType.Unknown,
  })
  type!: InviteType;

  @Column({ nullable: true })
  organizationId!: string;

  @ManyToOne('Organization', 'users', { nullable: true })
  organization!: Organization;

  @OneToMany('Role', 'users')
  roles!: Role[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
