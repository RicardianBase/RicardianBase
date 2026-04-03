import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestoneStatus } from "@/api/milestones";

export const useMilestoneAction = (contractId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      milestoneId,
      status,
    }: {
      milestoneId: string;
      status: string;
    }) => updateMilestoneStatus(contractId, milestoneId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts", contractId] });
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
