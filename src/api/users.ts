import client from './client';
import type { User, ApiResponse } from '@/types/api';

export const getProfile = () =>
  client.get<ApiResponse<User>>('/users/profile').then((r) => r.data.data);

export const updateProfile = (data: {
  display_name?: string;
  email?: string;
  avatar_url?: string;
}) =>
  client
    .patch<ApiResponse<User>>('/users/profile', data)
    .then((r) => r.data.data);

export const updateNotifications = (data: Record<string, boolean>) =>
  client
    .patch<ApiResponse<User>>('/users/notifications', data)
    .then((r) => r.data.data);

export interface ResolvedUser {
  id: string;
  username: string | null;
  display_name: string | null;
  walletAddress: string | null;
}

export const resolveUser = (identifier: string) =>
  client
    .get<ApiResponse<ResolvedUser>>(`/users/resolve/${encodeURIComponent(identifier)}`)
    .then((r) => r.data.data);
