import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
} from './entities/transaction.entity';
import {
  WalletAddress,
  WalletChain,
  WalletProvider,
} from './entities/wallet-address.entity';
import { TransactionQueryDto } from './dto/wallet-query.dto';
import { AddWalletDto } from './dto/add-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(WalletAddress)
    private readonly walletRepo: Repository<WalletAddress>,
  ) {}

  // TODO: Phase 2 — Query Solana RPC for real balances
  getBalances(_userId: string) {
    return [
      { token: 'USDC', balance: '0.00', chain: 'solana' },
      { token: 'PYUSD', balance: '0.00', chain: 'solana' },
    ];
  }

  async getTransactions(userId: string, query: TransactionQueryDto) {
    const qb = this.transactionRepo
      .createQueryBuilder('tx')
      .where('tx.user_id = :userId', { userId });

    if (query.type) {
      qb.andWhere('tx.type = :type', { type: query.type });
    }

    if (query.direction) {
      qb.andWhere('tx.direction = :direction', { direction: query.direction });
    }

    qb.orderBy('tx.created_at', 'DESC');

    const total = await qb.getCount();
    const data = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async recordTransaction(data: Partial<Transaction>) {
    const transaction = this.transactionRepo.create({
      ...data,
      status: data.status ?? TransactionStatus.CONFIRMED,
    });
    return this.transactionRepo.save(transaction);
  }

  async addWallet(userId: string, dto: AddWalletDto) {
    const existing = await this.walletRepo.findOne({
      where: { address: dto.address },
    });
    if (existing) {
      throw new ConflictException('Wallet address already registered');
    }

    const chain =
      dto.provider === 'phantom' ? WalletChain.SOLANA : WalletChain.ETHEREUM;

    const userWallets = await this.walletRepo.count({
      where: { user_id: userId },
    });

    const wallet = this.walletRepo.create({
      user_id: userId,
      address: dto.address,
      provider: dto.provider as WalletProvider,
      chain,
      is_primary: userWallets === 0,
    });

    return this.walletRepo.save(wallet);
  }

  async removeWallet(userId: string, walletId: string) {
    const wallet = await this.walletRepo.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.user_id !== userId) {
      throw new ForbiddenException('Not your wallet');
    }

    const count = await this.walletRepo.count({
      where: { user_id: userId },
    });

    if (count <= 1) {
      throw new BadRequestException('Cannot remove your only wallet');
    }

    const wasPrimary = wallet.is_primary;
    await this.walletRepo.remove(wallet);

    if (wasPrimary) {
      const next = await this.walletRepo.findOne({
        where: { user_id: userId },
      });
      if (next) {
        next.is_primary = true;
        await this.walletRepo.save(next);
      }
    }

    return { message: 'Wallet removed' };
  }
}
