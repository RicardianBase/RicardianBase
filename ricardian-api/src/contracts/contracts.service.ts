import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { Milestone, MilestoneStatus } from '../milestones/entities/milestone.entity';
import {
  ActivityService,
  CONTRACT_CREATED,
} from '../activity/activity.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractQueryDto } from './dto/contract-query.dto';

export const STATUS_TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  [ContractStatus.DRAFT]: [ContractStatus.ACTIVE, ContractStatus.CANCELLED],
  [ContractStatus.ACTIVE]: [
    ContractStatus.IN_REVIEW,
    ContractStatus.DISPUTED,
    ContractStatus.CANCELLED,
  ],
  [ContractStatus.IN_REVIEW]: [
    ContractStatus.ACTIVE,
    ContractStatus.COMPLETED,
    ContractStatus.DISPUTED,
  ],
  [ContractStatus.DISPUTED]: [ContractStatus.ACTIVE, ContractStatus.CANCELLED],
  [ContractStatus.COMPLETED]: [],
  [ContractStatus.CANCELLED]: [],
};

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    private readonly dataSource: DataSource,
    private readonly activityService: ActivityService,
  ) {}

  async findAll(userId: string, query: ContractQueryDto) {
    const qb = this.contractRepo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.milestones', 'milestone')
      .where(
        '(contract.client_id = :userId OR contract.contractor_id = :userId)',
        { userId },
      );

    if (query.status) {
      qb.andWhere('contract.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('contract.title ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(`contract.${query.sortBy}`, query.order);

    const total = await qb.getCount();
    const data = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Contract> {
    const contract = await this.contractRepo.findOne({
      where: { id },
      relations: ['milestones', 'client', 'contractor', 'template'],
      order: { milestones: { sequence: 'ASC' } },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.client_id !== userId && contract.contractor_id !== userId) {
      throw new ForbiddenException(
        'You do not have access to this contract',
      );
    }

    return contract;
  }

  async create(userId: string, dto: CreateContractDto): Promise<Contract> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const contract = queryRunner.manager.create(Contract, {
        title: dto.title,
        description: dto.description ?? null,
        template_id: dto.template_id ?? null,
        contractor_wallet: dto.contractor_wallet ?? null,
        client_id: userId,
        status: ContractStatus.DRAFT,
        total_amount: String(dto.total_amount),
        currency: dto.currency ?? 'USDC',
        progress: 0,
        start_date: dto.start_date ?? null,
        end_date: dto.end_date ?? null,
      });

      const savedContract = await queryRunner.manager.save(Contract, contract);

      const milestones = dto.milestones.map((m, index) =>
        queryRunner.manager.create(Milestone, {
          contract_id: savedContract.id,
          sequence: index + 1,
          title: m.title,
          description: m.description ?? null,
          amount: String(m.amount),
          status: MilestoneStatus.PENDING,
          due_date: m.due_date ?? null,
        }),
      );

      await queryRunner.manager.save(Milestone, milestones);

      await this.activityService.log(queryRunner.manager, {
        user_id: userId,
        contract_id: savedContract.id,
        action: CONTRACT_CREATED,
        description: `Created "${dto.title}"`,
      });

      await queryRunner.commitTransaction();

      return this.findOne(savedContract.id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateContractDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id, userId);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException(
        'Only draft contracts can be updated',
      );
    }

    if (contract.client_id !== userId) {
      throw new ForbiddenException('Only the client can update this contract');
    }

    Object.assign(contract, dto);
    await this.contractRepo.save(contract);

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const contract = await this.findOne(id, userId);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('Only draft contracts can be deleted');
    }

    if (contract.client_id !== userId) {
      throw new ForbiddenException('Only the client can delete this contract');
    }

    await this.contractRepo.remove(contract);
  }

  async transitionStatus(
    id: string,
    userId: string,
    newStatus: string,
  ): Promise<Contract> {
    const contract = await this.findOne(id, userId);
    const allowed = STATUS_TRANSITIONS[contract.status];

    if (!allowed.includes(newStatus as ContractStatus)) {
      throw new BadRequestException(
        `Cannot transition from '${contract.status}' to '${newStatus}'`,
      );
    }

    contract.status = newStatus as ContractStatus;
    await this.contractRepo.save(contract);

    const actionName = `contract_${newStatus.replace('-', '_')}`;
    await this.activityService.log({
      user_id: userId,
      contract_id: id,
      action: actionName,
      description: `Contract "${contract.title}" status changed to ${newStatus}`,
    });

    return this.findOne(id, userId);
  }
}
