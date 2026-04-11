import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Contract, ContractStatus } from './entities/contract.entity';
import { Milestone, MilestoneStatus } from '../milestones/entities/milestone.entity';
import {
  ActivityService,
  CONTRACT_CREATED,
} from '../activity/activity.service';
import {
  CreateContractDto,
  CreateContractParticipantDto,
} from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractQueryDto } from './dto/contract-query.dto';
import { WalletAddress } from '../wallet/entities/wallet-address.entity';
import { User } from '../users/entities/user.entity';
import {
  ContractParticipant,
  ContractParticipantRole,
} from './entities/contract-participant.entity';
import {
  getContractParticipants,
  hasContractAccess,
  isClientActor,
} from './utils/contract-participants';
import { toContractJsonLd } from './jsonld/contract.jsonld';
import { toContractMcpReadModel } from './mcp/contract.mcp';

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

type ResolvedParticipant = {
  role: ContractParticipantRole;
  user_id: string | null;
  wallet_address: string | null;
  username: string | null;
  payout_split: string | null;
  position: number;
};

const SPLIT_ELIGIBLE_ROLES = new Set<ContractParticipantRole>([
  ContractParticipantRole.CONTRACTOR,
  ContractParticipantRole.COLLABORATOR,
]);

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(WalletAddress)
    private readonly walletRepo: Repository<WalletAddress>,
    private readonly dataSource: DataSource,
    private readonly activityService: ActivityService,
  ) {}

  async findAll(userId: string, query: ContractQueryDto) {
    const qb = this.contractRepo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.milestones', 'milestone')
      .leftJoinAndSelect('contract.client', 'client')
      .leftJoinAndSelect('contract.contractor', 'contractor')
      .leftJoinAndSelect('contract.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'participantUser')
      .where(this.contractAccessWhere('contract'), { userId })
      .distinct(true);

    if (query.status) {
      qb.andWhere('contract.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('contract.title ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(`contract.${query.sortBy}`, query.order)
      .addOrderBy('participant.position', 'ASC')
      .addOrderBy('milestone.sequence', 'ASC');

    const total = await qb.getCount();
    const data = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return {
      data: data.map((contract) => this.attachCompatibilityParticipants(contract)),
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
      relations: [
        'milestones',
        'client',
        'contractor',
        'template',
        'participants',
        'participants.user',
      ],
      order: {
        milestones: { sequence: 'ASC' },
        participants: { position: 'ASC' },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (!hasContractAccess(contract, userId)) {
      throw new ForbiddenException(
        'You do not have access to this contract',
      );
    }

    return this.attachCompatibilityParticipants(contract);
  }

  async getJsonLd(id: string, userId: string) {
    const contract = await this.findOne(id, userId);
    return toContractJsonLd(contract);
  }

  async getMcpReadModel(id: string, userId: string) {
    const contract = await this.findOne(id, userId);
    return toContractMcpReadModel(contract);
  }

  async create(userId: string, dto: CreateContractDto): Promise<Contract> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const participants = await this.buildParticipants(userId, dto);
      const primaryCounterparty = this.getPrimaryCounterparty(participants);

      const contract = queryRunner.manager.create(Contract, {
        title: dto.title,
        description: dto.description ?? null,
        template_id: dto.template_id ?? null,
        contractor_id: primaryCounterparty?.user_id ?? null,
        contractor_wallet: primaryCounterparty?.wallet_address ?? null,
        client_id: userId,
        status: ContractStatus.DRAFT,
        total_amount: String(dto.total_amount),
        currency: dto.currency ?? 'USDC',
        progress: 0,
        start_date: dto.start_date ?? null,
        end_date: dto.end_date ?? null,
      });

      const savedContract = await queryRunner.manager.save(Contract, contract);

      const participantEntities = participants.map((participant) =>
        queryRunner.manager.create(ContractParticipant, {
          contract_id: savedContract.id,
          user_id: participant.user_id,
          role: participant.role,
          wallet_address: participant.wallet_address,
          username: participant.username,
          payout_split: participant.payout_split,
          position: participant.position,
        }),
      );

      await queryRunner.manager.save(ContractParticipant, participantEntities);

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

    if (!isClientActor(contract, userId)) {
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

    if (!isClientActor(contract, userId)) {
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

  private contractAccessWhere(alias: string) {
    return `(${alias}.client_id = :userId OR ${alias}.contractor_id = :userId OR EXISTS (SELECT 1 FROM contract_participants cp WHERE cp.contract_id = ${alias}.id AND cp.user_id = :userId))`;
  }

  private attachCompatibilityParticipants(contract: Contract): Contract {
    contract.participants = getContractParticipants(contract) as ContractParticipant[];
    return contract;
  }

  private async buildParticipants(
    userId: string,
    dto: CreateContractDto,
  ): Promise<ResolvedParticipant[]> {
    const currentUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['wallet_addresses'],
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const clientParticipant = this.buildClientParticipant(currentUser);
    const rawParticipants =
      dto.participants?.filter(
        (participant) => participant.role !== ContractParticipantRole.CLIENT,
      ) ??
      (dto.contractor_wallet
        ? [
            {
              role: ContractParticipantRole.CONTRACTOR,
              wallet_address: dto.contractor_wallet,
            } as CreateContractParticipantDto,
          ]
        : []);

    const resolvedParticipants = await Promise.all(
      rawParticipants.map((participant, index) =>
        this.resolveParticipant(participant, index + 1),
      ),
    );

    this.assertNoDuplicateParticipants(resolvedParticipants);

    const participants = [clientParticipant, ...resolvedParticipants].map(
      (participant, index) => ({
        ...participant,
        position: index,
      }),
    );

    this.applySplitDefaultsAndValidation(participants, dto.total_amount);
    return participants;
  }

  private buildClientParticipant(user: User): ResolvedParticipant {
    const primaryWallet = this.findPrimaryWallet(user);

    return {
      role: ContractParticipantRole.CLIENT,
      user_id: user.id,
      wallet_address: primaryWallet?.address ?? null,
      username: user.username,
      payout_split: null,
      position: 0,
    };
  }

  private async resolveParticipant(
    participant: CreateContractParticipantDto,
    position: number,
  ): Promise<ResolvedParticipant> {
    if (
      !participant.user_id &&
      !participant.wallet_address &&
      !participant.username
    ) {
      throw new BadRequestException(
        `Participant ${position} must include a wallet, username, or user id`,
      );
    }

    if (participant.user_id) {
      const user = await this.userRepo.findOne({
        where: { id: participant.user_id },
        relations: ['wallet_addresses'],
      });

      if (!user) {
        throw new BadRequestException(`Participant ${position} user not found`);
      }

      return {
        role: participant.role,
        user_id: user.id,
        wallet_address:
          participant.wallet_address ?? this.findPrimaryWallet(user)?.address ?? null,
        username: participant.username
          ? this.normalizeUsername(participant.username)
          : user.username,
        payout_split:
          participant.payout_split !== undefined
            ? participant.payout_split.toFixed(2)
            : null,
        position,
      };
    }

    if (participant.wallet_address) {
      const wallet = await this.walletRepo.findOne({
        where: { address: ILike(participant.wallet_address) },
        relations: ['user', 'user.wallet_addresses'],
      });

      return {
        role: participant.role,
        user_id: wallet?.user_id ?? null,
        wallet_address: wallet?.address ?? participant.wallet_address,
        username: wallet?.user?.username ?? this.optionalUsername(participant.username),
        payout_split:
          participant.payout_split !== undefined
            ? participant.payout_split.toFixed(2)
            : null,
        position,
      };
    }

    const username = this.normalizeUsername(participant.username!);
    const user = await this.userRepo.findOne({
      where: { username: ILike(username) },
      relations: ['wallet_addresses'],
    });

    if (!user) {
      throw new BadRequestException(
        `Participant ${position} username not found`,
      );
    }

    return {
      role: participant.role,
      user_id: user.id,
      wallet_address: this.findPrimaryWallet(user)?.address ?? null,
      username: user.username,
      payout_split:
        participant.payout_split !== undefined
          ? participant.payout_split.toFixed(2)
          : null,
      position,
    };
  }

  private assertNoDuplicateParticipants(
    participants: ResolvedParticipant[],
  ): void {
    const seen = new Set<string>();

    for (const participant of participants) {
      const key =
        participant.user_id
          ? `user:${participant.user_id}`
          : participant.wallet_address
          ? `wallet:${participant.wallet_address.toLowerCase()}`
          : participant.username
          ? `username:${participant.username.toLowerCase()}`
          : `role:${participant.role}:${participant.position}`;

      if (seen.has(key)) {
        throw new BadRequestException('Duplicate participants are not allowed');
      }

      seen.add(key);
    }
  }

  private applySplitDefaultsAndValidation(
    participants: ResolvedParticipant[],
    totalAmount: number,
  ): void {
    const splitEligibleParticipants = participants.filter((participant) =>
      SPLIT_ELIGIBLE_ROLES.has(participant.role),
    );

    if (totalAmount > 0 && splitEligibleParticipants.length === 1) {
      const [single] = splitEligibleParticipants;
      if (single.payout_split === null) {
        single.payout_split = '100.00';
      }
    }

    if (totalAmount <= 0 || splitEligibleParticipants.length === 0) {
      return;
    }

    if (splitEligibleParticipants.some((participant) => participant.payout_split === null)) {
      throw new BadRequestException(
        'Payout splits are required for each payout participant',
      );
    }

    const splitTotal = splitEligibleParticipants.reduce(
      (sum, participant) => sum + parseFloat(participant.payout_split!),
      0,
    );

    if (Math.abs(splitTotal - 100) > 0.001) {
      throw new BadRequestException(
        'Payout splits must add up to 100%',
      );
    }
  }

  private getPrimaryCounterparty(
    participants: ResolvedParticipant[],
  ): ResolvedParticipant | null {
    return (
      participants.find(
        (participant) => participant.role === ContractParticipantRole.CONTRACTOR,
      ) ??
      participants.find(
        (participant) => participant.role === ContractParticipantRole.COLLABORATOR,
      ) ??
      null
    );
  }

  private findPrimaryWallet(user: User): WalletAddress | null {
    return (
      user.wallet_addresses?.find((wallet) => wallet.is_primary) ??
      user.wallet_addresses?.[0] ??
      null
    );
  }

  private normalizeUsername(username: string): string {
    return username.trim().replace(/^@/, '').toLowerCase();
  }

  private optionalUsername(username?: string): string | null {
    if (!username?.trim()) {
      return null;
    }

    return this.normalizeUsername(username);
  }
}
