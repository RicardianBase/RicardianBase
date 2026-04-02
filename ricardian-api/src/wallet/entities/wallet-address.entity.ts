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

export enum WalletProvider {
  PHANTOM = 'phantom',
  METAMASK = 'metamask',
}

export enum WalletChain {
  SOLANA = 'solana',
  ETHEREUM = 'ethereum',
}

@Entity('wallet_addresses')
@Index(['address'], { unique: true })
@Index(['user_id'])
export class WalletAddress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  address!: string;

  @Column({
    type: 'enum',
    enum: WalletProvider,
  })
  provider!: WalletProvider;

  @Column({
    type: 'enum',
    enum: WalletChain,
  })
  chain!: WalletChain;

  @Column({ type: 'boolean', default: true })
  is_primary!: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true })
  nonce!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  nonce_expires_at!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.wallet_addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
