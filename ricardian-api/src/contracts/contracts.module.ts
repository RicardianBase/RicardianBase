import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractParticipant } from './entities/contract-participant.entity';
import { ContractTemplate } from './entities/contract-template.entity';
import { Milestone } from '../milestones/entities/milestone.entity';
import { User } from '../users/entities/user.entity';
import { WalletAddress } from '../wallet/entities/wallet-address.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Dispute } from '../disputes/entities/dispute.entity';
import { ActivityModule } from '../activity/activity.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { AiReviewService } from './ai/ai-review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contract,
      ContractParticipant,
      ContractTemplate,
      Milestone,
      User,
      WalletAddress,
      Transaction,
      Dispute,
    ]),
    ActivityModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService, AiReviewService],
  exports: [ContractsService],
})
export class ContractsModule {}
