import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Unique Ricardian username',
    minLength: 3,
    maxLength: 30,
    pattern: '^[A-Za-z0-9_-]+$',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'Username can only include letters, numbers, hyphens, and underscores',
  })
  username?: string;

  @ApiPropertyOptional({ description: 'Display name', maxLength: 100 })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(100)
  display_name?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Avatar URL or data URI' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  avatar_url?: string;
}
