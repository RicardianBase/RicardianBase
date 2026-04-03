import client from './client';
import type { WalletBalance, Transaction, ApiResponse } from '@/types/api';

export const getBalances = () =>
  client
    .get<ApiResponse<WalletBalance[]>>('/wallet/balances')
    .then((r) => r.data.data);

export const getTransactions = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  direction?: string;
}) =>
  client
    .get<ApiResponse<Transaction[]>>('/wallet/transactions', { params })
    .then((r) => r.data);
