"use client";

import { useMemo } from "react";
import { useUserData } from "@/Context/UserDataContext";

export function useNavbarState() {
  const { user } = useUserData();

  return useMemo(() => {
    const role = user?.role ?? null;
    const isCustomer = role === "Customer";

    return {
      role,
      isCustomer,
      shouldRenderCustomerTabs: isCustomer,
    };
  }, [user]);
}
