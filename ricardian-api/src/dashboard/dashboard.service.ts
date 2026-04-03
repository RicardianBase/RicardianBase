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

  async getStats(userId: string) {
    const [activeContracts, totalValueResult, pendingReviews, completedContracts] =
      await Promise.all([
        this.contractRepo.count({
          where: [
            { client_id: userId, status: ContractStatus.ACTIVE },
            { contractor_id: userId, status: ContractStatus.ACTIVE },
          ],
        }),

        this.contractRepo
          .createQueryBuilder('c')
          .select('COALESCE(SUM(c.total_amount), 0)', 'total')
          .where(
            '(c.client_id = :userId OR c.contractor_id = :userId)',
            { userId },
          )
          .getRawOne(),

        this.milestoneRepo
          .createQueryBuilder('m')
          .innerJoin('m.contract', 'c')
          .where(
            '(c.client_id = :userId OR c.contractor_id = :userId)',
            { userId },
          )
          .andWhere('m.status = :status', {
            status: MilestoneStatus.SUBMITTED,
          })
          .getCount(),

        this.contractRepo.count({
          where: [
            { client_id: userId, status: ContractStatus.COMPLETED },
            { contractor_id: userId, status: ContractStatus.COMPLETED },
          ],
        }),
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
