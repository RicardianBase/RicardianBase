import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listDisputes,
  createDispute,
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
