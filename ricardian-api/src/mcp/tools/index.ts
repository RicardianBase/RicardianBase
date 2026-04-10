import { Injectable } from '@nestjs/common';
import { ContractsService } from '../../contracts/contracts.service';
import { MilestonesService } from '../../milestones/milestones.service';
import { DisputesService } from '../../disputes/disputes.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { UsersService } from '../../users/users.service';
import { WalletService } from '../../wallet/wallet.service';
import { McpTool, ToolDefinition } from '../types';
import { buildContractTools } from './contracts.tools';
import { buildMilestoneTools } from './milestones.tools';
import { buildDisputeTools } from './disputes.tools';
import { buildDashboardTools } from './dashboard.tools';
import { buildUserTools } from './users.tools';
import { buildWalletTools } from './wallet.tools';

/**
 * Registry of MCP tools. Tools are assembled once at DI time by composing
 * per-domain tool factories. Each factory closes over the service(s) it needs,
 * so the registry's only job is lookup.
 */
@Injectable()
export class ToolRegistry {
  private readonly tools: Map<string, ToolDefinition>;

  constructor(
    contractsService: ContractsService,
    milestonesService: MilestonesService,
    disputesService: DisputesService,
    dashboardService: DashboardService,
    usersService: UsersService,
    walletService: WalletService,
  ) {
    const all: ToolDefinition[] = [
      ...buildContractTools(contractsService),
      ...buildMilestoneTools(milestonesService),
      ...buildDisputeTools(disputesService),
      ...buildDashboardTools(dashboardService),
      ...buildUserTools(usersService),
      ...buildWalletTools(walletService),
    ];

    this.tools = new Map(all.map((def) => [def.tool.name, def]));
  }

  list(): McpTool[] {
    return Array.from(this.tools.values()).map((d) => d.tool);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }
}
