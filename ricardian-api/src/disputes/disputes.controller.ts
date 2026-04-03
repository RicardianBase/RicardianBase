import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dispute' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.disputesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List disputes for the current user' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.disputesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single dispute by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.disputesService.findOne(id, userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition dispute status' })
  transitionStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateDisputeStatusDto,
  ) {
    return this.disputesService.transitionStatus(id, userId, dto.status);
  }
}
