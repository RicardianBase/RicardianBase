import { IsString, IsIn } from 'class-validator';

export class UpdateMilestoneStatusDto {
  @IsString()
  @IsIn(['in_progress', 'submitted', 'approved', 'rejected', 'paid'])
  status!: string;
}
