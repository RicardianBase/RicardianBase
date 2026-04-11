import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WalletAddress } from '../../wallet/entities/wallet-address.entity';
import { Contract } from '../../contracts/entities/contract.entity';
import { ContractParticipant } from '../../contracts/entities/contract-participant.entity';

export enum UserRole {
  COMPANY_ADMIN = 'company_admin',
  CONTRACTOR = 'contractor',
  PLATFORM_ADMIN = 'platform_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  username!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  display_name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONTRACTOR,
  })
  role!: UserRole;

  @Column({
    type: 'jsonb',
    default: {
      email: true,
      milestones: true,
      payments: true,
      disputes: true,
      digest: true,
    },
  })
  notification_prefs!: Record<string, boolean>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToMany(() => WalletAddress, (wallet) => wallet.user)
  wallet_addresses!: WalletAddress[];

  @OneToMany(() => Contract, (contract) => contract.client)
  client_contracts!: Contract[];

  @OneToMany(() => Contract, (contract) => contract.contractor)
  contractor_contracts!: Contract[];

  @OneToMany(() => ContractParticipant, (participant) => participant.user)
  contract_participations!: ContractParticipant[];
}
