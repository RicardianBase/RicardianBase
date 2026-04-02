import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

export const CONTRACT_CREATED = 'contract_created';
export const CONTRACT_ACTIVATED = 'contract_activated';
export const CONTRACT_COMPLETED = 'contract_completed';
export const CONTRACT_CANCELLED = 'contract_cancelled';
export const MILESTONE_SUBMITTED = 'milestone_submitted';
export const MILESTONE_APPROVED = 'milestone_approved';
export const MILESTONE_REJECTED = 'milestone_rejected';
export const DISPUTE_RAISED = 'dispute_raised';
export const PAYMENT_RELEASED = 'payment_released';

export interface ActivityLogData {
  user_id: string;
  contract_id?: string | null;
  action: string;
  description: string;
  metadata?: Record<string, unknown> | null;
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly logRepo: Repository<ActivityLog>,
  ) {}

  async log(data: ActivityLogData): Promise<ActivityLog>;
  async log(manager: EntityManager, data: ActivityLogData): Promise<ActivityLog>;
  async log(
    managerOrData: EntityManager | ActivityLogData,
    data?: ActivityLogData,
  ): Promise<ActivityLog> {
    if (data) {
      const manager = managerOrData as EntityManager;
      return manager.save(ActivityLog, manager.create(ActivityLog, data));
    }

    const logData = managerOrData as ActivityLogData;
    return this.logRepo.save(this.logRepo.create(logData));
  }
}
