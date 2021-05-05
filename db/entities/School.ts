import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Data } from '../../models/School';
import { SchoolType } from '../../models/SchoolType';
import { Property } from '../entities/Property';

@Entity()
export class School {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb' })
  data!: Partial<Data>;

  @Column({ nullable: true })
  googleId?: string;

  @Column()
  name!: string;

  @ManyToMany('Property', 'schools')
  @JoinTable()
  nearbyProperties!: Property[];

  @Column({
    type: 'enum',
    enum: SchoolType,
    nullable: true,
  })
  type?: SchoolType;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
