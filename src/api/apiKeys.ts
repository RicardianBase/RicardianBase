import client from './client';
import type { ApiKeyRecord, NewApiKey, CreateApiKeyInput, ApiResponse } from '@/types/api';

export const listApiKeys = () =>
  client
    .get<ApiResponse<ApiKeyRecord[]>>('/users/api-keys')
    .then((r) => r.data.data);

export const createApiKey = (input: CreateApiKeyInput) =>
  client
    .post<ApiResponse<NewApiKey>>('/users/api-keys', input)
    .then((r) => r.data.data);

export const revokeApiKey = (id: string) =>
  client
    .delete<ApiResponse<{ message: string }>>(`/users/api-keys/${id}`)
    .then((r) => r.data.data);
