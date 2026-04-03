import { useQuery } from "@tanstack/react-query";
import { getBalances, getTransactions } from "@/api/wallet";

export const useWalletBalances = () =>
  useQuery({
    queryKey: ["wallet", "balances"],
    queryFn: getBalances,
  });

export const useTransactions = (params?: {
  page?: number;
  limit?: number;
  type?: string;
}) =>
  useQuery({
    queryKey: ["wallet", "transactions", params],
    queryFn: () => getTransactions(params),
  });
