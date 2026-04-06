import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEscrow,
  confirmFunding,
  releasePayment,
  refundEscrow,
  getEscrowsForContract,
} from "@/api/escrow";

export const useContractEscrows = (contractId: string) =>
  useQuery({
    queryKey: ["escrows", contractId],
    queryFn: () => getEscrowsForContract(contractId),
    enabled: !!contractId,
  });

export const useCreateEscrow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, milestoneId }: { contractId: string; milestoneId?: string }) =>
      createEscrow(contractId, milestoneId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["escrows", vars.contractId] });
    },
  });
};

export const useConfirmFunding = (contractId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ escrowId, txHash }: { escrowId: string; txHash: string }) =>
      confirmFunding(escrowId, txHash),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escrows", contractId] });
      qc.invalidateQueries({ queryKey: ["contract", contractId] });
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};

export const useReleasePayment = (contractId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ escrowId, milestoneId }: { escrowId: string; milestoneId?: string }) =>
      releasePayment(escrowId, milestoneId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escrows", contractId] });
      qc.invalidateQueries({ queryKey: ["contract", contractId] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useRefundEscrow = (contractId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (escrowId: string) => refundEscrow(escrowId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["escrows", contractId] });
      qc.invalidateQueries({ queryKey: ["contract", contractId] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
