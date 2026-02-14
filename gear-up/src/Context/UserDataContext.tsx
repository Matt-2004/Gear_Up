"use client";

import { IUser, IUserData } from "@/app/types/user.types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserDataContextType {
  user: IUserData | null;
  setUser: (user: IUserData | null) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function UserDataProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: IUserData | null;
}) {
  const [user, setUser] = useState<IUserData | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    if (user) return;

    const hydrateUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) return;

        const response = (await res.json()) as IUser;
        if (response?.data) {
          setUser(response.data);
        }
      } catch {
        // no-op: keep unauthenticated state when request fails
      }
    };

    hydrateUser();
  }, [user]);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
