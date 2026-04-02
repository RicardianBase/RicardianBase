import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class TransactionQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: ['escrow_fund', 'milestone_release', 'deposit', 'withdrawal', 'refund'],
  })
  @IsOptional()
  @IsIn(['escrow_fund', 'milestone_release', 'deposit', 'withdrawal', 'refund'])
  type?: string;

  @ApiPropertyOptional({ enum: ['in', 'out'] })
  @IsOptional()
  @IsIn(['in', 'out'])
  direction?: string;
}
