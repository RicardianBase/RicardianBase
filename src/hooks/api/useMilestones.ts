import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestoneStatus } from "@/api/milestones";

export const useMilestoneAction = (contractId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      milestoneId,
      status,
      submissionNote,
      submissionFiles,
    }: {
      milestoneId: string;
      status: string;
      submissionNote?: string;
      submissionFiles?: { name: string; type: string; size: number; url: string }[];
    }) => updateMilestoneStatus(contractId, milestoneId, status, submissionNote, submissionFiles),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts", contractId] });
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
