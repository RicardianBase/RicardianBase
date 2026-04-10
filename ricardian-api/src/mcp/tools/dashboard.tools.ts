import { DashboardService } from '../../dashboard/dashboard.service';
import { ToolDefinition } from '../types';

export function buildDashboardTools(
  dashboardService: DashboardService,
): ToolDefinition[] {
  return [
    {
      tool: {
        name: 'ricardian_dashboard_stats',
        description:
          "High-level platform stats for the authenticated user: activeContracts, totalValue (sum of total_amount across all user's contracts), pendingReviews (submitted milestones awaiting client approval), and completedContracts.",
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      handler: async (user) => dashboardService.getStats(user.id),
    },
    {
      tool: {
        name: 'ricardian_recent_activity',
        description:
          'Most recent 20 activity log entries for the authenticated user (contract creation, milestone transitions, disputes raised, etc.), ordered newest first.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      handler: async (user) => dashboardService.getActivity(user.id),
    },
  ];
}
