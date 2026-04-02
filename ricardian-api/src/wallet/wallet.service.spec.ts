import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import {
  WalletAddress,
  WalletChain,
  WalletProvider,
} from './entities/wallet-address.entity';

const USER_ID = 'user-uuid';

describe('WalletService', () => {
  let service: WalletService;
  let transactionRepo: Record<string, jest.Mock>;
  let walletRepo: Record<string, jest.Mock>;
  let mockQueryBuilder: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
      getMany: jest.fn().mockResolvedValue([]),
    };

    transactionRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((data) => ({ id: 'tx-uuid', ...data })),
    };

    walletRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((data) => ({
        id: 'wallet-uuid',
        ...data,
      })),
      count: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: getRepositoryToken(Transaction), useValue: transactionRepo },
        { provide: getRepositoryToken(WalletAddress), useValue: walletRepo },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  describe('getBalances', () => {
    it('should return placeholder balances', () => {
      const result = service.getBalances(USER_ID);

      expect(result).toEqual([
        { token: 'USDC', balance: '0.00', chain: 'solana' },
        { token: 'PYUSD', balance: '0.00', chain: 'solana' },
      ]);
    });
  });

  describe('getTransactions', () => {
    it('should filter by type', async () => {
      await service.getTransactions(USER_ID, {
        type: 'deposit',
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        order: 'DESC',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'tx.type = :type',
        { type: 'deposit' },
      );
    });

    it('should paginate correctly', async () => {
      mockQueryBuilder.getCount.mockResolvedValue(50);

      const result = await service.getTransactions(USER_ID, {
        page: 3,
        limit: 10,
        sortBy: 'created_at',
        order: 'DESC',
      });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.meta).toEqual({
        page: 3,
        limit: 10,
        total: 50,
        totalPages: 5,
      });
    });
  });

  describe('addWallet', () => {
    it('should reject duplicate address', async () => {
      walletRepo.findOne.mockResolvedValue({ address: 'existing' });

      await expect(
        service.addWallet(USER_ID, {
          address: 'existing',
          provider: 'phantom',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('removeWallet', () => {
    it('should prevent removing last wallet', async () => {
      walletRepo.findOne.mockResolvedValue({
        id: 'wallet-uuid',
        user_id: USER_ID,
        is_primary: true,
      });
      walletRepo.count.mockResolvedValue(1);

      await expect(
        service.removeWallet(USER_ID, 'wallet-uuid'),
      ).rejects.toThrow(new BadRequestException('Cannot remove your only wallet'));
    });
  });

  describe('recordTransaction', () => {
    it('should save with confirmed status by default', async () => {
      await service.recordTransaction({
        user_id: USER_ID,
        amount: '100.00',
      } as Partial<Transaction>);

      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: TransactionStatus.CONFIRMED }),
      );
      expect(transactionRepo.save).toHaveBeenCalled();
    });
  });
});
