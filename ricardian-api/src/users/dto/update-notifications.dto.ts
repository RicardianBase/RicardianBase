import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  milestones?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  payments?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  disputes?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  digest?: boolean;
}
