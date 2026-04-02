import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Contract } from '../../contracts/entities/contract.entity';

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

@Entity('milestones')
@Index(['contract_id', 'sequence'])
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  contract_id!: string;

  @Column({ type: 'smallint' })
  sequence!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount!: string;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    default: MilestoneStatus.PENDING,
  })
  status!: MilestoneStatus;

  @Column({ type: 'date', nullable: true })
  due_date!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  submitted_at!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  approved_at!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  paid_at!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @ManyToOne(() => Contract, (contract) => contract.milestones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract!: Contract;
}
