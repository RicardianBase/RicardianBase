import client from './client';
import type { ApiKeyRecord, NewApiKey, ApiResponse } from '@/types/api';

export const listApiKeys = () =>
  client
    .get<ApiResponse<ApiKeyRecord[]>>('/users/api-keys')
    .then((r) => r.data.data);

export const createApiKey = (name?: string) =>
  client
    .post<ApiResponse<NewApiKey>>('/users/api-keys', { name })
    .then((r) => r.data.data);

export const revokeApiKey = (id: string) =>
  client
    .delete<ApiResponse<{ message: string }>>(`/users/api-keys/${id}`)
    .then((r) => r.data.data);
