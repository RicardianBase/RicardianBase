import client from './client';
import type { Dispute, ApiResponse } from '@/types/api';

export interface CreateDisputePayload {
  contract_id: string;
  milestone_id?: string;
  title: string;
  description?: string;
}

export const listDisputes = (params?: { page?: number; limit?: number }) =>
  client
    .get<ApiResponse<Dispute[]>>('/disputes', { params })
    .then((r) => r.data);

export const getDispute = (id: string) =>
  client
    .get<ApiResponse<Dispute>>(`/disputes/${id}`)
    .then((r) => r.data.data);

export const createDispute = (data: CreateDisputePayload) =>
  client
    .post<ApiResponse<Dispute>>('/disputes', data)
    .then((r) => r.data.data);

export const updateDisputeStatus = (id: string, status: string) =>
  client
    .patch<ApiResponse<Dispute>>(`/disputes/${id}/status`, { status })
    .then((r) => r.data.data);
