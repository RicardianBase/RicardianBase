import client from './client';
import type { DashboardStats, ActivityLog, ApiResponse } from '@/types/api';

export const getStats = () =>
  client
    .get<ApiResponse<DashboardStats>>('/dashboard/stats')
    .then((r) => r.data.data);

export const getActivity = () =>
  client
    .get<ApiResponse<ActivityLog[]>>('/dashboard/activity')
    .then((r) => r.data.data);
