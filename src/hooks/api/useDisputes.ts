import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listDisputes,
  createDispute,
  listEvidence,
  addEvidence,
  type CreateDisputePayload,
} from "@/api/disputes";

export const useDisputes = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: ["disputes", params],
    queryFn: () => listDisputes(params),
  });

export const useCreateDispute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDisputePayload) => createDispute(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["disputes"] });
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDisputeEvidence = (disputeId: string | null) =>
  useQuery({
    queryKey: ["dispute-evidence", disputeId],
    queryFn: () => listEvidence(disputeId!),
    enabled: !!disputeId,
  });

export const useAddEvidence = (disputeId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; attachment_url?: string }) =>
      addEvidence(disputeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dispute-evidence", disputeId] });
    },
  });
};
