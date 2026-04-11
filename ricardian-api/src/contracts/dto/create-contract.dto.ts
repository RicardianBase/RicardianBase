import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsIn,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CONTRACT_PARTICIPANT_ROLES,
  ContractParticipantRole,
} from '../entities/contract-participant.entity';

export class CreateMilestoneDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}

export class CreateContractParticipantDto {
  @IsString()
  @IsIn(CONTRACT_PARTICIPANT_ROLES)
  role!: ContractParticipantRole;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  wallet_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  username?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  payout_split?: number;
}

export class CreateContractDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  template_id?: string;

  @IsOptional()
  @IsString()
  contractor_wallet?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContractParticipantDto)
  participants?: CreateContractParticipantDto[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_amount!: number;

  @IsOptional()
  @IsString()
  @IsIn(['USDC', 'PYUSD'])
  currency?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMilestoneDto)
  milestones!: CreateMilestoneDto[];
}
