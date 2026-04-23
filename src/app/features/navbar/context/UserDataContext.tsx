"use client";

import { UserItem } from "@/app/features/navbar/types/user.types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserDataContextType {
  user: UserItem | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function UserDataContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(true);

  async function getEncryptedUserData() {
    const res = await fetch("/api/get-user-data", {
      cache: "no-store",
    });
    const response = await res.json();
    return response;
  }

  async function refreshUserData() {
    setLoading(true);
    try {
      const userDataDecrypted = await getEncryptedUserData();
      setUser(userDataDecrypted.data ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ user, loading, refreshUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  return <UserDataContextProvider>{children}</UserDataContextProvider>;
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
