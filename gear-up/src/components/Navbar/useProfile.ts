"use client";

import { getUserProfile } from "@/utils/FetchAPI";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const userProfile = () => {
  const [isTokenExist, setIsTokenExist] = useState(false);

  useEffect(() => {
    const isRefreshTokenExist = async () => {
      const token = await getRefreshToken();
      setIsTokenExist(token);
    };
    isRefreshTokenExist();
  }, []);

  const { data } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 5000,
    enabled: isTokenExist,
  });
  return data;
};
