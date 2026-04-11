import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { verifyMessage } from 'ethers';
import type { StringValue } from 'ms';
import { User, UserRole } from '../users/entities/user.entity';
import {
  WalletAddress,
  WalletChain,
  WalletProvider,
} from '../wallet/entities/wallet-address.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RequestNonceDto } from './dto/request-nonce.dto';
import { VerifyWalletDto } from './dto/verify-wallet.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(WalletAddress)
    private readonly walletRepo: Repository<WalletAddress>,
  ) {}

  async requestNonce(dto: RequestNonceDto) {
    const chain = WalletChain.ETHEREUM; // Both Phantom and MetaMask connect via EVM (Base)

    let wallet = await this.walletRepo.findOne({
      where: { address: dto.walletAddress },
    });

    if (!wallet) {
      const user = this.userRepo.create({ role: UserRole.CONTRACTOR });
      await this.userRepo.save(user);

      wallet = this.walletRepo.create({
        user_id: user.id,
        address: dto.walletAddress,
        provider: dto.provider as WalletProvider,
        chain,
        is_primary: true,
      });
    }

    const nonce = randomUUID();
    wallet.nonce = nonce;
    wallet.nonce_expires_at = new Date(Date.now() + 5 * 60 * 1000);
    await this.walletRepo.save(wallet);

    return {
      nonce,
      message: `Sign this message to authenticate with Ricardian: ${nonce}`,
    };
  }

  async verifyWallet(dto: VerifyWalletDto) {
    const wallet = await this.walletRepo.findOne({
      where: { address: dto.walletAddress },
      relations: ['user'],
    });

    if (!wallet) {
      throw new UnauthorizedException('Wallet not found');
    }

    if (!wallet.nonce) {
      throw new UnauthorizedException('No pending nonce');
    }

    if (!wallet.nonce_expires_at || wallet.nonce_expires_at < new Date()) {
      throw new UnauthorizedException('Nonce expired');
    }

    const message = `Sign this message to authenticate with Ricardian: ${wallet.nonce}`;

    let valid: boolean;
    try {
      // Both Phantom and MetaMask use EVM signatures (Base chain)
      valid = this.verifyEthereum(message, dto.signature, dto.walletAddress);
    } catch {
      valid = false;
    }

    if (!valid) {
      throw new UnauthorizedException('Invalid signature');
    }

    wallet.nonce = null;
    wallet.nonce_expires_at = null;
    await this.walletRepo.save(wallet);

    const tokens = this.issueTokens(wallet.user, wallet.address);

    return {
      ...tokens,
      user: {
        id: wallet.user.id,
        username: wallet.user.username,
        display_name: wallet.user.display_name,
        role: wallet.user.role,
        walletAddress: wallet.address,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.issueTokens(user, payload.walletAddress);
  }

  private issueTokens(user: User, walletAddress: string) {
    const payload: Omit<JwtPayload, 'type'> = {
      sub: user.id,
      walletAddress,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        expiresIn: this.configService.get<string>(
          'jwt.accessExpiry',
          '24h',
        ) as StringValue,
      },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: this.configService.get<string>(
          'jwt.refreshExpiry',
          '7d',
        ) as StringValue,
      },
    );

    return { accessToken, refreshToken };
  }

  private verifyEthereum(
    message: string,
    signature: string,
    address: string,
  ): boolean {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  }
}
