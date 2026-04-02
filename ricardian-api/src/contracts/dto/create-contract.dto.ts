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
} from 'class-validator';
import { Type } from 'class-transformer';

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
