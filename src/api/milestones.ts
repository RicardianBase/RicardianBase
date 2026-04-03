import client from './client';
import type { Milestone, ApiResponse } from '@/types/api';

export const updateMilestoneStatus = (
  contractId: string,
  milestoneId: string,
  status: string,
) =>
  client
    .patch<ApiResponse<Milestone>>(
      `/contracts/${contractId}/milestones/${milestoneId}/status`,
      { status },
    )
    .then((r) => r.data.data);
