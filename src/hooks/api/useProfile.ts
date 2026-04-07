import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, updateNotifications } from "@/api/users";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      display_name?: string;
      username?: string;
      email?: string;
      avatar_url?: string;
    }) => updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, boolean>) => updateNotifications(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
