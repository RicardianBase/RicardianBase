import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listContracts,
  getContract,
  createContract,
  updateContractStatus,
  deleteContract,
  type CreateContractPayload,
} from "@/api/contracts";

export const useContracts = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["contracts", params],
    queryFn: () => listContracts(params),
  });

export const useContract = (id: string) =>
  useQuery({
    queryKey: ["contracts", id],
    queryFn: () => getContract(id),
    enabled: !!id,
  });

export const useCreateContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContractPayload) => createContract(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateContractStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateContractStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["contracts", id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteContract = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContract(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contracts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
