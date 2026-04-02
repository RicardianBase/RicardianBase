import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone, MilestoneStatus } from './entities/milestone.entity';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import {
  Transaction,
  TransactionType,
  TransactionDirection,
  TransactionStatus,
} from '../wallet/entities/transaction.entity';
import { ActivityService } from '../activity/activity.service';
import { ContractsService } from '../contracts/contracts.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

interface TransitionRule {
  to: MilestoneStatus[];
  role: 'client' | 'contractor' | 'system';
}

export const MILESTONE_TRANSITIONS: Record<MilestoneStatus, TransitionRule> = {
  [MilestoneStatus.PENDING]: {
    to: [MilestoneStatus.IN_PROGRESS],
    role: 'contractor',
  },
  [MilestoneStatus.IN_PROGRESS]: {
    to: [MilestoneStatus.SUBMITTED],
    role: 'contractor',
  },
  [MilestoneStatus.SUBMITTED]: {
    to: [MilestoneStatus.APPROVED, MilestoneStatus.REJECTED],
    role: 'client',
  },
  [MilestoneStatus.REJECTED]: {
    to: [MilestoneStatus.IN_PROGRESS],
    role: 'contractor',
  },
  [MilestoneStatus.APPROVED]: {
    to: [MilestoneStatus.PAID],
    role: 'system',
  },
  [MilestoneStatus.PAID]: {
    to: [],
    role: 'system',
  },
};

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepo: Repository<Milestone>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly activityService: ActivityService,
    private readonly contractsService: ContractsService,
  ) {}

  async findAllForContract(
    contractId: string,
    userId: string,
  ): Promise<Milestone[]> {
    await this.contractsService.findOne(contractId, userId);

    return this.milestoneRepo.find({
      where: { contract_id: contractId },
      order: { sequence: 'ASC' },
    });
  }

  async addMilestone(
    contractId: string,
    userId: string,
    dto: CreateMilestoneDto,
  ): Promise<Milestone> {
    const contract = await this.contractsService.findOne(contractId, userId);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException(
        'Milestones can only be added to draft contracts',
      );
    }

    if (contract.client_id !== userId) {
      throw new ForbiddenException('Only the client can add milestones');
    }

    const count = await this.milestoneRepo.count({
      where: { contract_id: contractId },
    });

    const milestone = this.milestoneRepo.create({
      contract_id: contractId,
      sequence: count + 1,
      title: dto.title,
      description: dto.description ?? null,
      amount: String(dto.amount),
      status: MilestoneStatus.PENDING,
      due_date: dto.due_date ?? null,
    });

    return this.milestoneRepo.save(milestone);
  }

  async updateMilestone(
    contractId: string,
    milestoneId: string,
    userId: string,
    dto: UpdateMilestoneDto,
  ): Promise<Milestone> {
    const contract = await this.contractsService.findOne(contractId, userId);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException(
        'Milestones can only be updated on draft contracts',
      );
    }

    if (contract.client_id !== userId) {
      throw new ForbiddenException('Only the client can update milestones');
    }

    const milestone = await this.milestoneRepo.findOneBy({
      id: milestoneId,
      contract_id: contractId,
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (dto.title !== undefined) milestone.title = dto.title;
    if (dto.description !== undefined) milestone.description = dto.description;
    if (dto.amount !== undefined) milestone.amount = String(dto.amount);
    if (dto.due_date !== undefined) milestone.due_date = dto.due_date;

    return this.milestoneRepo.save(milestone);
  }

  async removeMilestone(
    contractId: string,
    milestoneId: string,
    userId: string,
  ): Promise<void> {
    const contract = await this.contractsService.findOne(contractId, userId);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException(
        'Milestones can only be removed from draft contracts',
      );
    }

    if (contract.client_id !== userId) {
      throw new ForbiddenException('Only the client can remove milestones');
    }

    const milestone = await this.milestoneRepo.findOneBy({
      id: milestoneId,
      contract_id: contractId,
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    await this.milestoneRepo.remove(milestone);
  }

  async transitionMilestoneStatus(
    contractId: string,
    milestoneId: string,
    userId: string,
    newStatus: string,
  ): Promise<Milestone> {
    const contract = await this.contractsService.findOne(contractId, userId);

    const milestone = contract.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    const rule = MILESTONE_TRANSITIONS[milestone.status];
    if (!rule.to.includes(newStatus as MilestoneStatus)) {
      throw new BadRequestException(
        `Cannot transition milestone from '${milestone.status}' to '${newStatus}'`,
      );
    }

    const callerRole =
      userId === contract.client_id ? 'client' : 'contractor';

    if (rule.role !== 'system' && rule.role !== callerRole) {
      throw new ForbiddenException(
        `Only the ${rule.role} can perform this transition`,
      );
    }

    milestone.status = newStatus as MilestoneStatus;

    if (newStatus === MilestoneStatus.SUBMITTED) {
      milestone.submitted_at = new Date();
    } else if (newStatus === MilestoneStatus.APPROVED) {
      milestone.approved_at = new Date();
    } else if (newStatus === MilestoneStatus.PAID) {
      milestone.paid_at = new Date();
    }

    await this.milestoneRepo.save(milestone);

    if (newStatus === MilestoneStatus.APPROVED && contract.contractor_id) {
      await this.transactionRepo.save(
        this.transactionRepo.create({
          user_id: contract.contractor_id,
          contract_id: contractId,
          milestone_id: milestoneId,
          type: TransactionType.MILESTONE_RELEASE,
          direction: TransactionDirection.IN,
          amount: milestone.amount,
          currency: contract.currency || 'USDC',
          description: `Payment: "${milestone.title}"`,
          status: TransactionStatus.CONFIRMED,
        }),
      );
    }

    await this.activityService.log({
      user_id: userId,
      contract_id: contractId,
      action: `milestone_${newStatus}`,
      description: `Milestone "${milestone.title}" status changed to ${newStatus}`,
    });

    await this.recalculateProgress(contractId);

    return milestone;
  }

  async recalculateProgress(contractId: string): Promise<void> {
    const milestones = await this.milestoneRepo.find({
      where: { contract_id: contractId },
    });

    const total = milestones.length;
    if (total === 0) return;

    const done = milestones.filter(
      (m) =>
        m.status === MilestoneStatus.APPROVED ||
        m.status === MilestoneStatus.PAID,
    ).length;

    const progress = Math.round((done / total) * 100);

    if (progress === 100) {
      await this.contractRepo.update(contractId, {
        progress,
        status: ContractStatus.COMPLETED,
      });
    } else {
      await this.contractRepo.update(contractId, { progress });
    }
  }
}
