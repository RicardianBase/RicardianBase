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
