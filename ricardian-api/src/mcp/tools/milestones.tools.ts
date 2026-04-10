import { MilestonesService } from '../../milestones/milestones.service';
import { ToolDefinition } from '../types';

const MILESTONE_STATUSES = [
  'in_progress',
  'submitted',
  'approved',
  'rejected',
  'paid',
] as const;

export function buildMilestoneTools(
  milestonesService: MilestonesService,
): ToolDefinition[] {
  return [
    {
      tool: {
        name: 'ricardian_list_milestones',
        description:
          'List milestones for a given Ricardian contract in sequence order. The authenticated user must be a party to the contract.',
        inputSchema: {
          type: 'object',
          properties: {
            contract_id: { type: 'string', description: 'Contract UUID' },
          },
          required: ['contract_id'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return milestonesService.findAllForContract(
          args.contract_id as string,
          user.id,
        );
      },
    },
    {
      tool: {
        name: 'ricardian_update_milestone_status',
        description:
          "Transition a milestone to a new status. Role-enforced: the contractor moves pending->in_progress->submitted and rejected->in_progress; the client approves or rejects submitted milestones. Approval auto-records a payment transaction to the contractor in the contract currency.",
        inputSchema: {
          type: 'object',
          properties: {
            contract_id: { type: 'string' },
            milestone_id: { type: 'string' },
            status: {
              type: 'string',
              enum: [...MILESTONE_STATUSES],
            },
          },
          required: ['contract_id', 'milestone_id', 'status'],
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        return milestonesService.transitionMilestoneStatus(
          args.contract_id as string,
          args.milestone_id as string,
          user.id,
          args.status as string,
        );
      },
    },
  ];
}
