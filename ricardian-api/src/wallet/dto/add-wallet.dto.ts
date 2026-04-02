import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class AddWalletDto {
  @ApiProperty({ description: 'Wallet address' })
  @IsString()
  @MinLength(32)
  @MaxLength(255)
  address!: string;

  @ApiProperty({ enum: ['phantom', 'metamask'] })
  @IsIn(['phantom', 'metamask'])
  provider!: 'phantom' | 'metamask';
}
