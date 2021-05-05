import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { Data } from '../../models/Property';
import { Organization } from '../entities/Organization';
import { School } from '../entities/School';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb' })
  data!: Partial<Data>;

  @Column()
  organizationId!: string;

  @ManyToOne('Organization', 'properties')
  organization!: Organization;

  @ManyToMany('School', 'nearbyProperties')
  schools!: School[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
