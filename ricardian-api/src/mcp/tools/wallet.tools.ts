import { WalletService } from '../../wallet/wallet.service';
import { TransactionQueryDto } from '../../wallet/dto/wallet-query.dto';
import { ToolDefinition } from '../types';

const TX_TYPES = [
  'escrow_fund',
  'milestone_release',
  'deposit',
  'withdrawal',
  'refund',
] as const;

export function buildWalletTools(
  walletService: WalletService,
): ToolDefinition[] {
  return [
    {
      tool: {
        name: 'ricardian_wallet_balances',
        description:
          'Get the authenticated user\'s wallet token balances (USDC, PYUSD). MVP placeholder until on-chain balance queries are wired up.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
      handler: async (user) => walletService.getBalances(user.id),
    },
    {
      tool: {
        name: 'ricardian_wallet_transactions',
        description:
          "List the authenticated user's transaction history (escrow funds, milestone releases, deposits, withdrawals, refunds). Supports filtering by type and direction, plus pagination.",
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [...TX_TYPES],
            },
            direction: { type: 'string', enum: ['in', 'out'] },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          },
          additionalProperties: false,
        },
      },
      handler: async (user, args) => {
        const query = new TransactionQueryDto();
        query.page = (args.page as number) ?? 1;
        query.limit = (args.limit as number) ?? 20;
        query.sortBy = 'created_at';
        query.order = 'DESC';
        if (args.type) query.type = args.type as string;
        if (args.direction) query.direction = args.direction as string;
        return walletService.getTransactions(user.id, query);
      },
    },
  ];
}
