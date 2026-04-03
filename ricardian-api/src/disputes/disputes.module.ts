import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { Milestone } from '../milestones/entities/milestone.entity';
import { ActivityModule } from '../activity/activity.module';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispute, Contract, Milestone]),
    ActivityModule,
  ],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
