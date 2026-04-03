import { useQuery } from "@tanstack/react-query";
import { getStats, getActivity } from "@/api/dashboard";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getStats,
    staleTime: 60_000,
  });

export const useDashboardActivity = () =>
  useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: getActivity,
    staleTime: 30_000,
  });
