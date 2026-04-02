import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
  ESCROW_FUND = 'escrow_fund',
  MILESTONE_RELEASE = 'milestone_release',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  REFUND = 'refund',
}

export enum TransactionDirection {
  IN = 'in',
  OUT = 'out',
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

@Entity('transactions')
@Index(['user_id'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', nullable: true })
  contract_id!: string | null;

  @Column({ type: 'uuid', nullable: true })
  milestone_id!: string | null;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionDirection,
  })
  direction!: TransactionDirection;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount!: string;

  @Column({ type: 'varchar', length: 10, default: 'USDC' })
  currency!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tx_hash!: string | null;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
