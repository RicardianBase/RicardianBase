import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DisputeStatus {
  UNDER_REVIEW = 'under_review',
  EVIDENCE_REQUIRED = 'evidence_required',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
}

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  contract_id!: string;

  @Column({ type: 'uuid', nullable: true })
  milestone_id!: string | null;

  @Column({ type: 'uuid' })
  initiated_by!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.UNDER_REVIEW,
  })
  status!: DisputeStatus;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  amount_locked!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
