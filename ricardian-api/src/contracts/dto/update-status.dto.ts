import { IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['active', 'in_review', 'completed', 'disputed', 'cancelled'])
  status!: string;
}
