import client from './client';
import type { WalletBalance, Transaction, WalletAddress, ApiResponse } from '@/types/api';

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

export const addWallet = (data: {
  address: string;
  provider: 'phantom' | 'metamask' | 'coinbase';
}) =>
  client
    .post<ApiResponse<WalletAddress>>('/wallet/addresses', data)
    .then((r) => r.data.data);

export const removeWallet = (id: string) =>
  client
    .delete<ApiResponse<{ message: string }>>(`/wallet/addresses/${id}`)
    .then((r) => r.data.data);
