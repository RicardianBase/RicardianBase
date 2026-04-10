import { DisputesService } from '../../disputes/disputes.service';
import { CreateDisputeDto } from '../../disputes/dto/create-dispute.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ToolDefinition } from '../types';

const DISPUTE_STATUSES = [
  'under_review',
  'evidence_required',
  'resolved',
  'escalated',
] as const;

export function buildDisputeTools(
  disputesService: DisputesService,
): ToolDefinition[] {
  return [
    {
      tool: {
        name: 'ricardian_create_dispute',
        description:
          'Open a dispute on a Ricardian contract. If a milestone_id is provided, only that milestone amount is locked. Otherwise the entire contract amount is locked. The contract is automatically marked disputed.',
        inputSchema: {
          type: 'object',
          properties: {
            contract_id: { type: 'string' },
            milestone_id: {
              type: 'string',
              description: 'Optional milestone UUID to scope the dispute',
            },
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
          },
          required: ['contract_id', 'title'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return disputesService.create(
          user.id,
          args as unknown as CreateDisputeDto,
        );
      },
    },
    {
      tool: {
        name: 'ricardian_list_disputes',
        description:
          'List disputes the user is involved in (as the initiator, the client, or the contractor).',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          },
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        const query = new PaginationDto();
        query.page = (args.page as number) ?? 1;
        query.limit = (args.limit as number) ?? 20;
        query.sortBy = 'created_at';
        query.order = 'DESC';
        return disputesService.findAll(user.id, query);
      },
    },
    {
      tool: {
        name: 'ricardian_get_dispute',
        description:
          'Fetch a single dispute by ID. The authenticated user must be a party to the underlying contract or the dispute initiator.',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return disputesService.findOne(args.id as string, user.id);
      },
    },
    {
      tool: {
        name: 'ricardian_update_dispute_status',
        description:
          "Transition a dispute to a new status. Allowed: under_review->evidence_required|resolved|escalated, evidence_required->under_review|resolved, escalated->resolved. Resolving a dispute returns the contract to active.",
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: {
              type: 'string',
              enum: [...DISPUTE_STATUSES],
            },
          },
          required: ['id', 'status'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return disputesService.transitionStatus(
          args.id as string,
          user.id,
          args.status as string,
        );
      },
    },
  ];
}
