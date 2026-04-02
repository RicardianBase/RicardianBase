import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { Milestone, MilestoneStatus } from './entities/milestone.entity';
import { Contract, ContractStatus } from '../contracts/entities/contract.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { ActivityService } from '../activity/activity.service';
import { ContractsService } from '../contracts/contracts.service';

const CLIENT_ID = 'client-uuid';
const CONTRACTOR_ID = 'contractor-uuid';
const CONTRACT_ID = 'contract-uuid';
const MILESTONE_ID = 'milestone-uuid';

const mockMilestone = (overrides: Partial<Milestone> = {}): Milestone =>
  ({
    id: MILESTONE_ID,
    contract_id: CONTRACT_ID,
    sequence: 1,
    title: 'Test Milestone',
    description: null,
    amount: '500.00',
    status: MilestoneStatus.PENDING,
    due_date: null,
    submitted_at: null,
    approved_at: null,
    paid_at: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }) as Milestone;

const mockContract = (
  milestoneOverrides: Partial<Milestone> = {},
  contractOverrides: Partial<Contract> = {},
): Contract =>
  ({
    id: CONTRACT_ID,
    title: 'Test Contract',
    client_id: CLIENT_ID,
    contractor_id: CONTRACTOR_ID,
    status: ContractStatus.ACTIVE,
    total_amount: '1000.00',
    currency: 'USDC',
    progress: 0,
    milestones: [mockMilestone(milestoneOverrides)],
    ...contractOverrides,
  }) as Contract;

describe('MilestonesService', () => {
  let service: MilestonesService;
  let milestoneRepo: Record<string, jest.Mock>;
  let contractRepo: Record<string, jest.Mock>;
  let transactionRepo: Record<string, jest.Mock>;
  let activityService: Record<string, jest.Mock>;
  let contractsService: Record<string, jest.Mock>;

  beforeEach(async () => {
    milestoneRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
      count: jest.fn(),
      remove: jest.fn(),
    };

    contractRepo = {
      update: jest.fn().mockResolvedValue({}),
    };

    transactionRepo = {
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockResolvedValue({}),
    };

    activityService = {
      log: jest.fn().mockResolvedValue({}),
    };

    contractsService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilestonesService,
        {
          provide: getRepositoryToken(Milestone),
          useValue: milestoneRepo,
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: contractRepo,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionRepo,
        },
        {
          provide: ActivityService,
          useValue: activityService,
        },
        {
          provide: ContractsService,
          useValue: contractsService,
        },
      ],
    }).compile();

    service = module.get<MilestonesService>(MilestonesService);
  });

  describe('transitionMilestoneStatus - role enforcement', () => {
    it('should allow contractor to submit milestone', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.IN_PROGRESS }),
      );
      milestoneRepo.find.mockResolvedValue([
        mockMilestone({ status: MilestoneStatus.SUBMITTED }),
      ]);

      const result = await service.transitionMilestoneStatus(
        CONTRACT_ID,
        MILESTONE_ID,
        CONTRACTOR_ID,
        'submitted',
      );

      expect(result.status).toBe(MilestoneStatus.SUBMITTED);
    });

    it('should reject contractor trying to approve', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.SUBMITTED }),
      );

      await expect(
        service.transitionMilestoneStatus(
          CONTRACT_ID,
          MILESTONE_ID,
          CONTRACTOR_ID,
          'approved',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject client trying to submit', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.IN_PROGRESS }),
      );

      await expect(
        service.transitionMilestoneStatus(
          CONTRACT_ID,
          MILESTONE_ID,
          CLIENT_ID,
          'submitted',
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should reject invalid status transitions', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.PENDING }),
      );

      await expect(
        service.transitionMilestoneStatus(
          CONTRACT_ID,
          MILESTONE_ID,
          CONTRACTOR_ID,
          'approved',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('transitionMilestoneStatus - side effects', () => {
    it('should auto-create transaction on approval', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.SUBMITTED }),
      );
      milestoneRepo.find.mockResolvedValue([
        mockMilestone({ status: MilestoneStatus.APPROVED }),
      ]);

      await service.transitionMilestoneStatus(
        CONTRACT_ID,
        MILESTONE_ID,
        CLIENT_ID,
        'approved',
      );

      expect(transactionRepo.save).toHaveBeenCalled();
      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: CONTRACTOR_ID,
          contract_id: CONTRACT_ID,
          milestone_id: MILESTONE_ID,
          type: 'milestone_release',
          direction: 'in',
          status: 'confirmed',
        }),
      );
    });

    it('should recalculate progress after status change', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.IN_PROGRESS }),
      );
      milestoneRepo.find.mockResolvedValue([
        mockMilestone({ status: MilestoneStatus.SUBMITTED }),
        mockMilestone({ id: 'ms-2', status: MilestoneStatus.PENDING }),
      ]);

      await service.transitionMilestoneStatus(
        CONTRACT_ID,
        MILESTONE_ID,
        CONTRACTOR_ID,
        'submitted',
      );

      expect(contractRepo.update).toHaveBeenCalledWith(CONTRACT_ID, {
        progress: 0,
      });
    });

    it('should auto-complete contract when all milestones approved/paid', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.SUBMITTED }),
      );
      milestoneRepo.find.mockResolvedValue([
        mockMilestone({ status: MilestoneStatus.APPROVED }),
      ]);

      await service.transitionMilestoneStatus(
        CONTRACT_ID,
        MILESTONE_ID,
        CLIENT_ID,
        'approved',
      );

      expect(contractRepo.update).toHaveBeenCalledWith(CONTRACT_ID, {
        progress: 100,
        status: ContractStatus.COMPLETED,
      });
    });
  });

  describe('transitionMilestoneStatus - timestamps', () => {
    it('should set submitted_at timestamp on submission', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.IN_PROGRESS }),
      );
      milestoneRepo.find.mockResolvedValue([
        mockMilestone({ status: MilestoneStatus.SUBMITTED }),
      ]);

      const result = await service.transitionMilestoneStatus(
        CONTRACT_ID,
        MILESTONE_ID,
        CONTRACTOR_ID,
        'submitted',
      );

      expect(result.submitted_at).toBeInstanceOf(Date);
    });

    it('should set approved_at timestamp on approval', async () => {
      contractsService.findOne.mockResolvedValue(
        mockContract({ status: MilestoneStatus.SUBMITTED }),
      );
      milestoneRepo.find.mockResolvedValue([
        mockMilestone({ status: MilestoneStatus.APPROVED }),
      ]);

      const result = await service.transitionMilestoneStatus(
        CONTRACT_ID,
        MILESTONE_ID,
        CLIENT_ID,
        'approved',
      );

      expect(result.approved_at).toBeInstanceOf(Date);
    });
  });
});
