import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { UpdateMilestoneStatusDto } from './dto/update-milestone-status.dto';

@ApiTags('milestones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contracts/:contractId/milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  @ApiOperation({ summary: 'List milestones for a contract' })
  findAll(
    @Param('contractId', ParseUUIDPipe) contractId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.milestonesService.findAllForContract(contractId, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a milestone to a draft contract' })
  create(
    @Param('contractId', ParseUUIDPipe) contractId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMilestoneDto,
  ) {
    return this.milestonesService.addMilestone(contractId, userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a milestone on a draft contract' })
  update(
    @Param('contractId', ParseUUIDPipe) contractId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.milestonesService.updateMilestone(
      contractId,
      id,
      userId,
      dto,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition milestone status' })
  transitionStatus(
    @Param('contractId', ParseUUIDPipe) contractId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMilestoneStatusDto,
  ) {
    return this.milestonesService.transitionMilestoneStatus(
      contractId,
      id,
      userId,
      dto.status,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a milestone from a draft contract' })
  remove(
    @Param('contractId', ParseUUIDPipe) contractId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.milestonesService.removeMilestone(contractId, id, userId);
  }
}
