import client from './client';
import type { ApiResponse } from '@/types/api';

export interface EscrowRecord {
  id: string;
  contract_id: string;
  milestone_id: string | null;
  client_wallet: string;
  freelancer_wallet: string | null;
  amount: string;
  platform_fee: string;
  total_locked: string;
  currency: string;
  escrow_account: string;
  fund_tx_hash: string | null;
  release_tx_hash: string | null;
  status: 'pending' | 'funded' | 'released' | 'disputed' | 'refunded';
  created_at: string;
  funded_at: string | null;
  released_at: string | null;
}

export interface CreateEscrowResponse {
  id: string;
  amount: number;
  platform_fee: number;
  total_locked: number;
  escrow_account: string;
  currency: string;
  status: string;
}

export const getPlatformWallet = () =>
  client.get<ApiResponse<{ address: string }>>('/escrow/platform-wallet').then((r) => r.data.data);

export const createEscrow = (contractId: string, milestoneId?: string) =>
  client
    .post<ApiResponse<CreateEscrowResponse>>('/escrow/create', {
      contract_id: contractId,
      milestone_id: milestoneId,
    })
    .then((r) => r.data.data);

export const confirmFunding = (escrowId: string, txHash: string) =>
  client
    .post<ApiResponse<{ status: string; tx_hash: string }>>(`/escrow/${escrowId}/confirm`, {
      tx_hash: txHash,
    })
    .then((r) => r.data.data);

export const releasePayment = (escrowId: string, milestoneId?: string) =>
  client
    .post<ApiResponse<{ status: string; tx_hash: string }>>('/escrow/release', {
      escrow_id: escrowId,
      milestone_id: milestoneId,
    })
    .then((r) => r.data.data);

export const refundEscrow = (escrowId: string) =>
  client
    .post<ApiResponse<{ status: string; tx_hash: string }>>(`/escrow/${escrowId}/refund`)
    .then((r) => r.data.data);

export const getEscrowsForContract = (contractId: string) =>
  client
    .get<ApiResponse<EscrowRecord[]>>(`/escrow/contract/${contractId}`)
    .then((r) => r.data.data);
