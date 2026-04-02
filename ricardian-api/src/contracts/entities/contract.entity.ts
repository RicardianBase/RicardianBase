import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContractTemplate } from './contract-template.entity';
import { Milestone } from '../../milestones/entities/milestone.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_REVIEW = 'in_review',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
}

@Entity('contracts')
@Index(['client_id'])
@Index(['contractor_id'])
@Index(['status'])
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid', nullable: true })
  template_id!: string | null;

  @Column({ type: 'uuid' })
  client_id!: string;

  @Column({ type: 'uuid', nullable: true })
  contractor_id!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractor_wallet!: string | null;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status!: ContractStatus;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total_amount!: string;

  @Column({ type: 'varchar', length: 10, default: 'USDC' })
  currency!: string;

  @Column({ type: 'smallint', default: 0 })
  progress!: number;

  @Column({ type: 'date', nullable: true })
  start_date!: string | null;

  @Column({ type: 'date', nullable: true })
  end_date!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @ManyToOne(() => ContractTemplate)
  @JoinColumn({ name: 'template_id' })
  template!: ContractTemplate | null;

  @ManyToOne(() => User, (user) => user.client_contracts)
  @JoinColumn({ name: 'client_id' })
  client!: User;

  @ManyToOne(() => User, (user) => user.contractor_contracts)
  @JoinColumn({ name: 'contractor_id' })
  contractor!: User | null;

  @OneToMany(() => Milestone, (milestone) => milestone.contract, {
    cascade: true,
  })
  milestones!: Milestone[];
}
