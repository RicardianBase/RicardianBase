import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from './entities/milestone.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { ContractsModule } from '../contracts/contracts.module';
import { ActivityModule } from '../activity/activity.module';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Milestone, Contract, Transaction]),
    ContractsModule,
    ActivityModule,
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
