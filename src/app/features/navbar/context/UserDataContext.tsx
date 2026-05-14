"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserModel } from "../../profiles/user/types/user.model";

interface UserDataContextType {
  user: UserModel | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function UserDataContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);

  const getEncryptedUserData = useCallback(async () => {
    const res = await fetch("/api/get-user-data", {
      cache: "no-store",
    });
    const response = await res.json();
    return response;
  }, []);

  const refreshUserData = useCallback(async () => {
    setLoading(true);
    try {
      const userDataDecrypted = await getEncryptedUserData();
      setUser(userDataDecrypted.data ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getEncryptedUserData]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

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
