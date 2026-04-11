import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { User } from '../../users/entities/user.entity';

export enum ContractParticipantRole {
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
  COLLABORATOR = 'collaborator',
  REVIEWER = 'reviewer',
  OBSERVER = 'observer',
}

export const CONTRACT_PARTICIPANT_ROLES = Object.values(
  ContractParticipantRole,
);

@Entity('contract_participants')
@Index(['contract_id'])
@Index(['user_id'])
@Index(['role'])
@Index(['contract_id', 'position'])
export class ContractParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  contract_id!: string;

  @Column({ type: 'uuid', nullable: true })
  user_id!: string | null;

  @Column({ type: 'varchar', length: 32 })
  role!: ContractParticipantRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wallet_address!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  username!: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  payout_split!: string | null;

  @Column({ type: 'smallint', default: 0 })
  position!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @ManyToOne(() => Contract, (contract) => contract.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract!: Contract;

  @ManyToOne(() => User, (user) => user.contract_participations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
