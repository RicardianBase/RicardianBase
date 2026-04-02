import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User, UserRole } from '../users/entities/user.entity';
import {
  WalletAddress,
  WalletChain,
  WalletProvider,
} from '../wallet/entities/wallet-address.entity';

const USER_ID = 'user-uuid';
const WALLET_ADDRESS = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
const NONCE = 'test-nonce-uuid';

const mockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: USER_ID,
    display_name: null,
    email: null,
    avatar_url: null,
    role: UserRole.CONTRACTOR,
    notification_prefs: {},
    created_at: new Date(),
    updated_at: new Date(),
    wallet_addresses: [],
    client_contracts: [],
    contractor_contracts: [],
    ...overrides,
  }) as User;

const mockWallet = (overrides: Partial<WalletAddress> = {}): WalletAddress =>
  ({
    id: 'wallet-uuid',
    user_id: USER_ID,
    address: WALLET_ADDRESS,
    provider: WalletProvider.PHANTOM,
    chain: WalletChain.SOLANA,
    is_primary: true,
    nonce: NONCE,
    nonce_expires_at: new Date(Date.now() + 5 * 60 * 1000),
    created_at: new Date(),
    user: mockUser(),
    ...overrides,
  }) as WalletAddress;

// Mock crypto.randomUUID
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => NONCE),
}));

// Mock tweetnacl
jest.mock('tweetnacl', () => ({
  sign: {
    detached: {
      verify: jest.fn(() => true),
    },
  },
}));

// Mock bs58
jest.mock('bs58', () => ({
  __esModule: true,
  default: {
    decode: jest.fn(() => new Uint8Array(32)),
  },
}));

// Mock ethers
jest.mock('ethers', () => ({
  verifyMessage: jest.fn(() => WALLET_ADDRESS),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Record<string, jest.Mock>;
  let walletRepo: Record<string, jest.Mock>;
  let jwtService: Record<string, jest.Mock>;
  let configService: Record<string, jest.Mock>;

  beforeEach(async () => {
    userRepo = {
      create: jest.fn().mockImplementation((data) => ({ id: USER_ID, ...data })),
      save: jest.fn().mockImplementation((data) => ({ id: USER_ID, ...data })),
      findOne: jest.fn(),
    };

    walletRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((data) => data),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    };

    configService = {
      get: jest.fn().mockImplementation((key: string, defaultValue?: string) => {
        const map: Record<string, string> = {
          'jwt.accessExpiry': '24h',
          'jwt.refreshExpiry': '7d',
        };
        return map[key] ?? defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(WalletAddress), useValue: walletRepo },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('requestNonce', () => {
    it('should create new user and wallet for unknown address', async () => {
      walletRepo.findOne.mockResolvedValue(null);

      const result = await service.requestNonce({
        walletAddress: WALLET_ADDRESS,
        provider: 'phantom',
      });

      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.CONTRACTOR }),
      );
      expect(walletRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          address: WALLET_ADDRESS,
          provider: 'phantom',
          chain: WalletChain.SOLANA,
        }),
      );
      expect(walletRepo.save).toHaveBeenCalled();
      expect(result.nonce).toBe(NONCE);
      expect(result.message).toContain(NONCE);
    });

    it('should reuse existing wallet for known address', async () => {
      const existingWallet = mockWallet({ nonce: null });
      walletRepo.findOne.mockResolvedValue(existingWallet);

      await service.requestNonce({
        walletAddress: WALLET_ADDRESS,
        provider: 'phantom',
      });

      expect(userRepo.save).not.toHaveBeenCalled();
      expect(walletRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ nonce: NONCE }),
      );
    });

    it('should set nonce expiry to 5 minutes from now', async () => {
      walletRepo.findOne.mockResolvedValue(mockWallet());
      const before = Date.now() + 5 * 60 * 1000;

      await service.requestNonce({
        walletAddress: WALLET_ADDRESS,
        provider: 'phantom',
      });

      const after = Date.now() + 5 * 60 * 1000;
      const savedWallet = walletRepo.save.mock.calls[0][0];
      const expiryTime = savedWallet.nonce_expires_at.getTime();
      expect(expiryTime).toBeGreaterThanOrEqual(before - 100);
      expect(expiryTime).toBeLessThanOrEqual(after + 100);
    });
  });

  describe('verifyWallet', () => {
    it('should reject expired nonce', async () => {
      walletRepo.findOne.mockResolvedValue(
        mockWallet({ nonce_expires_at: new Date(Date.now() - 1000) }),
      );

      await expect(
        service.verifyWallet({
          walletAddress: WALLET_ADDRESS,
          signature: 'sig',
          provider: 'phantom',
        }),
      ).rejects.toThrow(new UnauthorizedException('Nonce expired'));
    });

    it('should reject missing nonce', async () => {
      walletRepo.findOne.mockResolvedValue(
        mockWallet({ nonce: null }),
      );

      await expect(
        service.verifyWallet({
          walletAddress: WALLET_ADDRESS,
          signature: 'sig',
          provider: 'phantom',
        }),
      ).rejects.toThrow(new UnauthorizedException('No pending nonce'));
    });

    it('should nullify nonce after successful verification', async () => {
      const wallet = mockWallet();
      walletRepo.findOne.mockResolvedValue(wallet);

      await service.verifyWallet({
        walletAddress: WALLET_ADDRESS,
        signature: 'valid-sig',
        provider: 'phantom',
      });

      expect(walletRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          nonce: null,
          nonce_expires_at: null,
        }),
      );
    });

    it('should return access and refresh tokens with correct types', async () => {
      walletRepo.findOne.mockResolvedValue(mockWallet());

      const result = await service.verifyWallet({
        walletAddress: WALLET_ADDRESS,
        signature: 'valid-sig',
        provider: 'phantom',
      });

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'access' }),
        expect.any(Object),
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'refresh' }),
        expect.any(Object),
      );
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject invalid signature', async () => {
      const nacl = jest.requireMock('tweetnacl');
      nacl.sign.detached.verify.mockReturnValueOnce(false);
      walletRepo.findOne.mockResolvedValue(mockWallet());

      await expect(
        service.verifyWallet({
          walletAddress: WALLET_ADDRESS,
          signature: 'bad-sig',
          provider: 'phantom',
        }),
      ).rejects.toThrow(new UnauthorizedException('Invalid signature'));
    });
  });

  describe('refreshTokens', () => {
    it('should reject access token used as refresh', async () => {
      jwtService.verify.mockReturnValue({
        sub: USER_ID,
        walletAddress: WALLET_ADDRESS,
        role: 'contractor',
        type: 'access',
      });

      await expect(
        service.refreshTokens('some-access-token'),
      ).rejects.toThrow(new UnauthorizedException('Invalid token type'));
    });

    it('should issue new token pair for valid refresh token', async () => {
      jwtService.verify.mockReturnValue({
        sub: USER_ID,
        walletAddress: WALLET_ADDRESS,
        role: 'contractor',
        type: 'refresh',
      });
      userRepo.findOne.mockResolvedValue(mockUser());

      const result = await service.refreshTokens('valid-refresh-token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
