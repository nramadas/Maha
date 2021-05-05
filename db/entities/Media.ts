import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Data } from '../../models/Media';
import { MediaParentType } from '../../models/MediaParentType';
import { MediaType } from '../../models/MediaType';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type!: MediaType;

  @Column({ type: 'jsonb' })
  data!: Partial<Data>;

  @Column({ nullable: true })
  parentId?: string;

  @Column({
    type: 'enum',
    enum: MediaParentType,
    nullable: true,
  })
  parentType?: MediaParentType;

  @Column()
  src!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deleted!: Date;
}
