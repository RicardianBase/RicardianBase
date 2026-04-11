import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Dispute, DisputeStatus } from './entities/dispute.entity';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { Milestone } from '../milestones/entities/milestone.entity';
import {
  ActivityService,
  DISPUTE_RAISED,
} from '../activity/activity.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { hasContractAccess } from '../contracts/utils/contract-participants';

const STATUS_TRANSITIONS: Record<DisputeStatus, DisputeStatus[]> = {
  [DisputeStatus.UNDER_REVIEW]: [
    DisputeStatus.EVIDENCE_REQUIRED,
    DisputeStatus.RESOLVED,
    DisputeStatus.ESCALATED,
  ],
  [DisputeStatus.EVIDENCE_REQUIRED]: [
    DisputeStatus.UNDER_REVIEW,
    DisputeStatus.RESOLVED,
  ],
  [DisputeStatus.ESCALATED]: [DisputeStatus.RESOLVED],
  [DisputeStatus.RESOLVED]: [],
};

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute)
    private readonly disputeRepo: Repository<Dispute>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(Milestone)
    private readonly milestoneRepo: Repository<Milestone>,
    private readonly dataSource: DataSource,
    private readonly activityService: ActivityService,
  ) {}

  async create(userId: string, dto: CreateDisputeDto): Promise<Dispute> {
    const contract = await this.contractRepo.findOne({
      where: { id: dto.contract_id },
      relations: ['milestones', 'participants'],
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (!hasContractAccess(contract, userId)) {
      throw new ForbiddenException('You are not a party to this contract');
    }

    let amountLocked: string | null = null;

    if (dto.milestone_id) {
      const milestone = contract.milestones.find(
        (m) => m.id === dto.milestone_id,
      );
      if (!milestone) {
        throw new NotFoundException('Milestone not found on this contract');
      }
      amountLocked = milestone.amount;
    } else {
      amountLocked = contract.total_amount;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dispute = queryRunner.manager.create(Dispute, {
        contract_id: dto.contract_id,
        milestone_id: dto.milestone_id ?? null,
        initiated_by: userId,
        title: dto.title,
        description: dto.description ?? null,
        status: DisputeStatus.UNDER_REVIEW,
        amount_locked: amountLocked,
      });

      const saved = await queryRunner.manager.save(Dispute, dispute);

      await queryRunner.manager.update(Contract, dto.contract_id, {
        status: ContractStatus.DISPUTED,
      });

      await this.activityService.log(queryRunner.manager, {
        user_id: userId,
        contract_id: dto.contract_id,
        action: DISPUTE_RAISED,
        description: `Dispute raised: "${dto.title}"`,
      });

      await queryRunner.commitTransaction();

      return this.findOne(saved.id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string, query: PaginationDto) {
    const qb = this.disputeRepo
      .createQueryBuilder('dispute')
      .innerJoin('contracts', 'contract', 'contract.id = dispute.contract_id')
      .where(
        '(dispute.initiated_by = :userId OR contract.client_id = :userId OR contract.contractor_id = :userId OR EXISTS (SELECT 1 FROM contract_participants cp WHERE cp.contract_id = contract.id AND cp.user_id = :userId))',
        { userId },
      );

    qb.orderBy(`dispute.${query.sortBy}`, query.order);

    const total = await qb.getCount();
    const data = await qb
      .skip((query.page! - 1) * query.limit!)
      .take(query.limit)
      .getMany();

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit!),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Dispute> {
    const dispute = await this.disputeRepo.findOne({
      where: { id },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    const contract = await this.contractRepo.findOne({
      where: { id: dispute.contract_id },
      relations: ['participants'],
    });

    if (!contract || (dispute.initiated_by !== userId && !hasContractAccess(contract, userId))) {
      throw new ForbiddenException('You do not have access to this dispute');
    }

    return dispute;
  }

  async transitionStatus(
    id: string,
    userId: string,
    newStatus: string,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id, userId);
    const allowed = STATUS_TRANSITIONS[dispute.status];

    if (!allowed.includes(newStatus as DisputeStatus)) {
      throw new BadRequestException(
        `Cannot transition from '${dispute.status}' to '${newStatus}'`,
      );
    }

    dispute.status = newStatus as DisputeStatus;
    await this.disputeRepo.save(dispute);

    if (newStatus === DisputeStatus.RESOLVED) {
      await this.contractRepo.update(dispute.contract_id, {
        status: ContractStatus.ACTIVE,
      });
    }

    await this.activityService.log({
      user_id: userId,
      contract_id: dispute.contract_id,
      action: `dispute_${newStatus}`,
      description: `Dispute "${dispute.title}" status changed to ${newStatus}`,
    });

    return dispute;
  }
}
