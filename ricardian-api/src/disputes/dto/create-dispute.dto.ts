import { IsUUID, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateDisputeDto {
  @IsUUID()
  contract_id!: string;

  @IsOptional()
  @IsUUID()
  milestone_id?: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
