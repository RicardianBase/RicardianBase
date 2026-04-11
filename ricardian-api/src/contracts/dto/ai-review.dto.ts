import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AiReviewRequestDto {
  @IsString()
  @MinLength(20, {
    message: 'Contract text must be at least 20 characters',
  })
  @MaxLength(30000, {
    message: 'Contract text must be at most 30,000 characters',
  })
  text!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}

export type AiReviewFlagSeverity = 'info' | 'warning' | 'critical';

export interface AiReviewFlag {
  severity: AiReviewFlagSeverity;
  clause: string;
  issue: string;
  suggestion: string;
}

export interface AiReviewResponse {
  summary: string;
  overall_risk: 'low' | 'medium' | 'high';
  flags: AiReviewFlag[];
  model: string;
}
