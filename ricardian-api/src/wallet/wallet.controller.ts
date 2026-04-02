import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WalletService } from './wallet.service';
import { TransactionQueryDto } from './dto/wallet-query.dto';
import { AddWalletDto } from './dto/add-wallet.dto';

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balances')
  @ApiOperation({ summary: 'Get wallet balances (placeholder for MVP)' })
  getBalances(@CurrentUser('id') userId: string) {
    return this.walletService.getBalances(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get paginated transaction history' })
  getTransactions(
    @CurrentUser('id') userId: string,
    @Query() query: TransactionQueryDto,
  ) {
    return this.walletService.getTransactions(userId, query);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new wallet address' })
  addWallet(
    @CurrentUser('id') userId: string,
    @Body() dto: AddWalletDto,
  ) {
    return this.walletService.addWallet(userId, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Remove a wallet address' })
  removeWallet(
    @CurrentUser('id') userId: string,
    @Param('id') walletId: string,
  ) {
    return this.walletService.removeWallet(userId, walletId);
  }
}
