import client from './client';
import type {
  Contract,
  ContractParticipantRole,
  ApiResponse,
} from '@/types/api';

export interface CreateContractParticipantPayload {
  role: ContractParticipantRole;
  user_id?: string;
  wallet_address?: string;
  username?: string;
  payout_split?: number;
}

export interface CreateContractPayload {
  title: string;
  description?: string;
  template_id?: string;
  contractor_wallet?: string;
  participants?: CreateContractParticipantPayload[];
  total_amount: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  milestones: Array<{
    title: string;
    description?: string;
    amount: number;
    due_date?: string;
  }>;
}

export const listContracts = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}) =>
  client
    .get<ApiResponse<Contract[]>>('/contracts', { params })
    .then((r) => r.data);

export const getContract = (id: string) =>
  client
    .get<ApiResponse<Contract>>(`/contracts/${id}`)
    .then((r) => r.data.data);

export const createContract = (data: CreateContractPayload) =>
  client
    .post<ApiResponse<Contract>>('/contracts', data)
    .then((r) => r.data.data);

export const updateContract = (
  id: string,
  data: Partial<Pick<Contract, 'title' | 'description' | 'start_date' | 'end_date'>>,
) =>
  client
    .patch<ApiResponse<Contract>>(`/contracts/${id}`, data)
    .then((r) => r.data.data);

export const updateContractStatus = (id: string, status: string) =>
  client
    .patch<ApiResponse<Contract>>(`/contracts/${id}/status`, { status })
    .then((r) => r.data.data);

export const deleteContract = (id: string) =>
  client.delete(`/contracts/${id}`);
