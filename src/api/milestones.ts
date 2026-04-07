import client from './client';
import type { Milestone, ApiResponse } from '@/types/api';

export const updateMilestoneStatus = (
  contractId: string,
  milestoneId: string,
  status: string,
  submissionNote?: string,
  submissionFiles?: { name: string; type: string; size: number; url: string }[],
) =>
  client
    .patch<ApiResponse<Milestone>>(
      `/contracts/${contractId}/milestones/${milestoneId}/status`,
      {
        status,
        ...(submissionNote ? { submission_note: submissionNote } : {}),
        ...(submissionFiles?.length ? { submission_files: submissionFiles } : {}),
      },
    )
    .then((r) => r.data.data);
