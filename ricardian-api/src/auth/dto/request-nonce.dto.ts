import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class RequestNonceDto {
  @ApiProperty({ description: 'Wallet address to request a nonce for' })
  @IsString()
  @MinLength(32)
  @MaxLength(255)
  walletAddress!: string;

  @ApiProperty({
    description: 'Wallet provider',
    enum: ['phantom', 'metamask'],
  })
  @IsIn(['phantom', 'metamask'])
  provider!: 'phantom' | 'metamask';
}
