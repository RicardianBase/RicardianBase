import { ContractsService } from '../../contracts/contracts.service';
import { ContractQueryDto } from '../../contracts/dto/contract-query.dto';
import { CreateContractDto } from '../../contracts/dto/create-contract.dto';
import { ToolDefinition } from '../types';

const CONTRACT_STATUSES = [
  'draft',
  'active',
  'in_review',
  'completed',
  'disputed',
  'cancelled',
] as const;

const TRANSITIONABLE_STATUSES = [
  'active',
  'in_review',
  'completed',
  'disputed',
  'cancelled',
] as const;

export function buildContractTools(
  contractsService: ContractsService,
): ToolDefinition[] {
  return [
    {
      tool: {
        name: 'ricardian_list_contracts',
        description:
          "List Ricardian contracts the authenticated user is a party to (as client or contractor). Supports filtering by status, case-insensitive title search, and pagination. Returns { data, meta } with contracts and their milestones.",
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: [...CONTRACT_STATUSES],
              description: 'Filter by contract status',
            },
            search: {
              type: 'string',
              description: 'Case-insensitive substring match on contract title',
            },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          },
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        const query = new ContractQueryDto();
        query.page = (args.page as number) ?? 1;
        query.limit = (args.limit as number) ?? 20;
        query.sortBy = 'created_at';
        query.order = 'DESC';
        if (args.status) query.status = args.status as string;
        if (args.search) query.search = args.search as string;
        return contractsService.findAll(user.id, query);
      },
    },
    {
      tool: {
        name: 'ricardian_get_contract',
        description:
          'Fetch a single Ricardian contract by ID, including its milestones, client, contractor, and template. The authenticated user must be a party to the contract.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Contract UUID' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return contractsService.findOne(args.id as string, user.id);
      },
    },
    {
      tool: {
        name: 'ricardian_create_contract',
        description:
          'Create a new Ricardian contract in DRAFT status. The authenticated user becomes the client. Must include at least one milestone. Currency defaults to USDC.',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            template_id: {
              type: 'string',
              description: 'Optional contract template UUID',
            },
            contractor_wallet: {
              type: 'string',
              description: 'Wallet address of the contractor',
            },
            total_amount: { type: 'number', minimum: 0 },
            currency: {
              type: 'string',
              enum: ['USDC', 'PYUSD'],
              default: 'USDC',
            },
            start_date: { type: 'string', format: 'date-time' },
            end_date: { type: 'string', format: 'date-time' },
            milestones: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', maxLength: 255 },
                  description: { type: 'string' },
                  amount: { type: 'number', minimum: 0 },
                  due_date: { type: 'string', format: 'date-time' },
                },
                required: ['title', 'amount'],
                additionalProperties: false,
              },
            },
          },
          required: ['title', 'total_amount', 'milestones'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return contractsService.create(
          user.id,
          args as unknown as CreateContractDto,
        );
      },
    },
    {
      tool: {
        name: 'ricardian_update_contract_status',
        description:
          "Transition a contract to a new status. Allowed transitions: draft->active|cancelled, active->in_review|disputed|cancelled, in_review->active|completed|disputed, disputed->active|cancelled. Terminal states (completed, cancelled) can't transition.",
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Contract UUID' },
            status: {
              type: 'string',
              enum: [...TRANSITIONABLE_STATUSES],
            },
          },
          required: ['id', 'status'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return contractsService.transitionStatus(
          args.id as string,
          user.id,
          args.status as string,
        );
      },
    },
  ];
}
