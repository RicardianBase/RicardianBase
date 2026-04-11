import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { WalletAddress } from '../wallet/entities/wallet-address.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';

const ETH_WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(WalletAddress)
    private readonly walletRepo: Repository<WalletAddress>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['wallet_addresses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.serializeProfile(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email, id: Not(userId) },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    if (dto.username !== undefined) {
      const normalizedUsername = this.normalizeUsername(dto.username);

      if (!normalizedUsername) {
        user.username = null;
      } else {
        const existing = await this.userRepo.findOne({
          where: { username: ILike(normalizedUsername), id: Not(userId) },
        });

        if (existing) {
          throw new ConflictException('Username already taken');
        }

        user.username = normalizedUsername;
      }
    }

    if (dto.display_name !== undefined) {
      user.display_name = dto.display_name || null;
    }

    if (dto.email !== undefined) {
      user.email = dto.email || null;
    }

    if (dto.avatar_url !== undefined) {
      user.avatar_url = dto.avatar_url || null;
    }

    return this.userRepo.save(user);
  }

  async updateNotifications(userId: string, dto: UpdateNotificationsDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.notification_prefs = { ...user.notification_prefs, ...dto };
    return this.userRepo.save(user);
  }

  async resolveIdentifier(identifier: string) {
    const normalized = identifier.trim();

    if (!normalized) {
      throw new NotFoundException('User not found');
    }

    const isWallet = ETH_WALLET_REGEX.test(normalized);
    const username = this.normalizeUsername(normalized.replace(/^@/, ''));

    if (isWallet) {
      const wallet = await this.walletRepo.findOne({
        where: { address: ILike(normalized) },
        relations: ['user'],
      });

      if (!wallet?.user) {
        throw new NotFoundException('User not found');
      }

      return {
        id: wallet.user.id,
        username: wallet.user.username,
        display_name: wallet.user.display_name,
        walletAddress: wallet.address,
      };
    }

    if (!username) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepo.findOne({
      where: { username: ILike(username) },
      relations: ['wallet_addresses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const primaryWallet =
      user.wallet_addresses.find((wallet) => wallet.is_primary) ??
      user.wallet_addresses[0] ??
      null;

    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      walletAddress: primaryWallet?.address ?? null,
    };
  }

  private normalizeUsername(username: string): string {
    return username.trim().replace(/^@/, '').toLowerCase();
  }

  private serializeProfile(user: User) {
    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: user.role,
      notification_prefs: user.notification_prefs,
      created_at: user.created_at,
      updated_at: user.updated_at,
      wallets: user.wallet_addresses.map((wallet) => ({
        id: wallet.id,
        address: wallet.address,
        provider: wallet.provider,
        chain: wallet.chain,
        is_primary: wallet.is_primary,
        created_at: wallet.created_at,
      })),
    };
  }
}
