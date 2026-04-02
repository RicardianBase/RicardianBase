import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContractsService } from './contracts.service';
import { Contract, ContractStatus } from './entities/contract.entity';
import { ActivityService } from '../activity/activity.service';

const CLIENT_ID = 'client-uuid';
const CONTRACTOR_ID = 'contractor-uuid';
const CONTRACT_ID = 'contract-uuid';

const mockContract = (overrides: Partial<Contract> = {}): Contract =>
  ({
    id: CONTRACT_ID,
    title: 'Test Contract',
    description: null,
    template_id: null,
    client_id: CLIENT_ID,
    contractor_id: CONTRACTOR_ID,
    contractor_wallet: null,
    status: ContractStatus.DRAFT,
    total_amount: '1000.00',
    currency: 'USDC',
    progress: 0,
    start_date: null,
    end_date: null,
    created_at: new Date(),
    updated_at: new Date(),
    milestones: [],
    client: {} as any,
    contractor: {} as any,
    template: null,
    ...overrides,
  }) as Contract;

describe('ContractsService', () => {
  let service: ContractsService;
  let contractRepo: Record<string, jest.Mock>;
  let mockQueryRunner: Record<string, any>;
  let mockDataSource: Record<string, any>;
  let activityService: Record<string, jest.Mock>;

  beforeEach(async () => {
    contractRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        create: jest.fn().mockImplementation((_entity, data) => data),
        save: jest.fn().mockImplementation((_entity, data) => ({
          id: CONTRACT_ID,
          ...data,
        })),
      },
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    activityService = {
      log: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: getRepositoryToken(Contract),
          useValue: contractRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ActivityService,
          useValue: activityService,
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
  });

  describe('create', () => {
    it('should create contract with milestones in a single transaction', async () => {
      const dto = {
        title: 'New Contract',
        total_amount: 1000,
        milestones: [
          { title: 'Milestone 1', amount: 500 },
          { title: 'Milestone 2', amount: 500 },
        ],
      };

      contractRepo.findOne.mockResolvedValue(mockContract());

      await service.create(CLIENT_ID, dto);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      // Contract save + milestones save = 2 manager.save calls
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2);
      // Activity log via ActivityService with EntityManager
      expect(activityService.log).toHaveBeenCalledWith(
        mockQueryRunner.manager,
        expect.objectContaining({ action: 'contract_created' }),
      );
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on milestone validation failure', async () => {
      const dto = {
        title: 'New Contract',
        total_amount: 1000,
        milestones: [{ title: 'Milestone 1', amount: 500 }],
      };

      mockQueryRunner.manager.save
        .mockResolvedValueOnce({ id: CONTRACT_ID }) // contract save
        .mockRejectedValueOnce(new Error('DB error')); // milestone save fails

      await expect(service.create(CLIENT_ID, dto)).rejects.toThrow('DB error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('transitionStatus', () => {
    it('should reject invalid status transitions', async () => {
      contractRepo.findOne.mockResolvedValue(mockContract());

      await expect(
        service.transitionStatus(CONTRACT_ID, CLIENT_ID, 'completed'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow valid status transitions', async () => {
      const contract = mockContract();
      contractRepo.findOne.mockResolvedValue(contract);
      contractRepo.save.mockResolvedValue({
        ...contract,
        status: ContractStatus.ACTIVE,
      });

      const result = await service.transitionStatus(
        CONTRACT_ID,
        CLIENT_ID,
        'active',
      );

      expect(result.status).toBe(ContractStatus.ACTIVE);
      expect(activityService.log).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should filter contracts by user role', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue([mockContract()]),
      };
      contractRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.findAll(CLIENT_ID, {
        page: 1,
        limit: 20,
        sortBy: 'created_at',
        order: 'DESC',
      });

      expect(mockQb.where).toHaveBeenCalledWith(
        '(contract.client_id = :userId OR contract.contractor_id = :userId)',
        { userId: CLIENT_ID },
      );
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('update', () => {
    it('should block non-client from updating draft', async () => {
      contractRepo.findOne.mockResolvedValue(mockContract());

      await expect(
        service.update(CONTRACT_ID, CONTRACTOR_ID, { title: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
