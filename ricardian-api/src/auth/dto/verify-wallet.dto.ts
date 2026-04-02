import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class VerifyWalletDto {
  @ApiProperty({ description: 'Wallet address that signed the nonce' })
  @IsString()
  @IsNotEmpty()
  walletAddress!: string;

  @ApiProperty({
    description: 'Signature produced by the wallet (base58 for Solana, hex for Ethereum)',
  })
  @IsString()
  @IsNotEmpty()
  signature!: string;

  @ApiProperty({
    description: 'Wallet provider',
    enum: ['phantom', 'metamask'],
  })
  @IsIn(['phantom', 'metamask'])
  provider!: 'phantom' | 'metamask';
}
