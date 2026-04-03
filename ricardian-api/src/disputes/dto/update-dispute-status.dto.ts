import { IsString, IsIn } from 'class-validator';
import { DisputeStatus } from '../entities/dispute.entity';

export class UpdateDisputeStatusDto {
  @IsString()
  @IsIn([
    DisputeStatus.UNDER_REVIEW,
    DisputeStatus.EVIDENCE_REQUIRED,
    DisputeStatus.RESOLVED,
    DisputeStatus.ESCALATED,
  ])
  status!: string;
}
