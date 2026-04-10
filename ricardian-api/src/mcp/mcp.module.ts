import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContractsModule } from '../contracts/contracts.module';
import { MilestonesModule } from '../milestones/milestones.module';
import { DisputesModule } from '../disputes/disputes.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { ToolRegistry } from './tools';

@Module({
  imports: [
    AuthModule,
    ContractsModule,
    MilestonesModule,
    DisputesModule,
    DashboardModule,
    UsersModule,
    WalletModule,
  ],
  controllers: [McpController],
  providers: [McpService, ToolRegistry],
})
export class McpModule {}
