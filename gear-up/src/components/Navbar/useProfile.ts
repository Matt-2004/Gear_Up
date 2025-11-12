"use client";

import { IProfileFormData } from "@/app/hooks/useJSON";
import { getUserProfile } from "@/utils/FetchAPI";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = await getRefreshToken();
      if (!token) {
        return;
      }
      return getUserProfile();
    },
    staleTime: 5000,
    retry: false,
  });
  return { data, refetch, isLoading };
};
