import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { Milestone, MilestoneStatus } from '../milestones/entities/milestone.entity';
import { ActivityLog } from '../activity/entities/activity-log.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(Milestone)
    private readonly milestoneRepo: Repository<Milestone>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
  ) {}

  private contractAccessWhere(alias: string) {
    return `(${alias}.client_id = :userId OR ${alias}.contractor_id = :userId OR EXISTS (SELECT 1 FROM contract_participants cp WHERE cp.contract_id = ${alias}.id AND cp.user_id = :userId))`;
  }

  async getStats(userId: string) {
    const [activeContracts, totalValueResult, pendingReviews, completedContracts] =
      await Promise.all([
        this.contractRepo
          .createQueryBuilder('c')
          .where(this.contractAccessWhere('c'), { userId })
          .andWhere('c.status = :status', { status: ContractStatus.ACTIVE })
          .getCount(),

        this.contractRepo
          .createQueryBuilder('c')
          .select('COALESCE(SUM(c.total_amount), 0)', 'total')
          .where(this.contractAccessWhere('c'), { userId })
          .getRawOne(),

        this.milestoneRepo
          .createQueryBuilder('m')
          .innerJoin('m.contract', 'c')
          .where(this.contractAccessWhere('c'), { userId })
          .andWhere('m.status = :status', {
            status: MilestoneStatus.SUBMITTED,
          })
          .getCount(),

        this.contractRepo
          .createQueryBuilder('c')
          .where(this.contractAccessWhere('c'), { userId })
          .andWhere('c.status = :status', { status: ContractStatus.COMPLETED })
          .getCount(),
      ]);

    return {
      activeContracts,
      totalValue: parseFloat(totalValueResult?.total ?? '0'),
      pendingReviews,
      completedContracts,
    };
  }

  async getActivity(userId: string) {
    return this.activityLogRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 20,
    });
  }
}
