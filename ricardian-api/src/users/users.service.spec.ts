import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import {
  WalletAddress,
  WalletChain,
  WalletProvider,
} from '../wallet/entities/wallet-address.entity';

const USER_ID = 'user-1';

const createUser = (overrides: Partial<User> = {}): User =>
  ({
    id: USER_ID,
    username: 'builder',
    display_name: 'Builder',
    email: 'builder@example.com',
    avatar_url: null,
    role: UserRole.CONTRACTOR,
    notification_prefs: {
      email: true,
      milestones: true,
      payments: true,
      disputes: true,
      digest: true,
    },
    created_at: new Date(),
    updated_at: new Date(),
    wallet_addresses: [],
    client_contracts: [],
    contractor_contracts: [],
    ...overrides,
  }) as User;

const createWallet = (
  overrides: Partial<WalletAddress> = {},
): WalletAddress =>
  ({
    id: 'wallet-1',
    user_id: USER_ID,
    address: '0x1111111111111111111111111111111111111111',
    provider: WalletProvider.METAMASK,
    chain: WalletChain.ETHEREUM,
    is_primary: true,
    nonce: null,
    nonce_expires_at: null,
    created_at: new Date(),
    user: createUser(),
    ...overrides,
  }) as WalletAddress;

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Record<string, jest.Mock>;
  let walletRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation((user) => user),
    };

    walletRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        {
          provide: getRepositoryToken(WalletAddress),
          useValue: walletRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('includes username in the serialized profile', async () => {
    const wallet = createWallet();
    userRepo.findOne.mockResolvedValue(
      createUser({ wallet_addresses: [wallet] }),
    );

    const profile = await service.getProfile(USER_ID);

    expect(profile).toEqual(
      expect.objectContaining({
        id: USER_ID,
        username: 'builder',
        wallets: [
          expect.objectContaining({
            id: wallet.id,
            address: wallet.address,
          }),
        ],
      }),
    );
  });

  it('normalizes usernames before saving profile updates', async () => {
    const user = createUser({ username: null });
    userRepo.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);

    const updatedUser = await service.updateProfile(USER_ID, {
      username: ' Builder_One ',
    });

    expect(userRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'builder_one' }),
    );
    expect(updatedUser.username).toBe('builder_one');
  });

  it('rejects username collisions during profile updates', async () => {
    userRepo.findOne
      .mockResolvedValueOnce(createUser())
      .mockResolvedValueOnce(createUser({ id: 'user-2', username: 'builder' }));

    await expect(
      service.updateProfile(USER_ID, { username: 'builder' }),
    ).rejects.toThrow(new ConflictException('Username already taken'));
  });

  it('resolves a user by username', async () => {
    userRepo.findOne.mockResolvedValue(
      createUser({
        wallet_addresses: [createWallet()],
      }),
    );

    const resolved = await service.resolveIdentifier('@Builder');

    expect(resolved).toEqual({
      id: USER_ID,
      username: 'builder',
      display_name: 'Builder',
      walletAddress: '0x1111111111111111111111111111111111111111',
    });
  });

  it('resolves a user by wallet address', async () => {
    walletRepo.findOne.mockResolvedValue(
      createWallet({
        address: '0xAbCdEfabcdefABCDefabcdefABCDefabcdefABCD',
        user: createUser(),
      }),
    );

    const resolved = await service.resolveIdentifier(
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    );

    expect(resolved).toEqual({
      id: USER_ID,
      username: 'builder',
      display_name: 'Builder',
      walletAddress: '0xAbCdEfabcdefABCDefabcdefABCDefabcdefABCD',
    });
  });

  it('throws when an identifier cannot be resolved', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.resolveIdentifier('unknown-user')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });
});
