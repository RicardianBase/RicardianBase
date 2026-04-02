import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ContractQueryDto } from './dto/contract-query.dto';

@ApiTags('contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'List contracts for the current user' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: ContractQueryDto,
  ) {
    return this.contractsService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single contract by ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.contractsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contract with milestones' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateContractDto,
  ) {
    return this.contractsService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a draft contract' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, userId, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition contract status' })
  transitionStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.contractsService.transitionStatus(id, userId, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a draft contract' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.contractsService.remove(id, userId);
  }
}
