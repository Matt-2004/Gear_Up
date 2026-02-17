"use client";

import { IUser, IUserData } from "@/app/types/user.types";
import {
    createContext,
    ReactNode,
    useContext,
    useState
} from "react";

interface UserDataContextType {
    user: IUserData | null;
    setUser: (user: IUserData | null) => void;
    loading: boolean;
    refreshUser: () => Promise<IUserData | null>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
    undefined,
);

export function UserDataContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<IUserData | null>(null);
    const [loading, setLoading] = useState(false);

    // Function to manually refresh user data from API
    const refreshUser = async (): Promise<IUserData | null> => {
        setLoading(true);
        try {
            const res = await fetch("/api/user", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            if (res.ok) {
                const response: IUser = await res.json();
                if (response?.data) {
                    setUser(response.data);
                    return response.data;
                }
            }
            setUser(null);
            return null;
        } catch (error) {
            console.error("Failed to refresh user data:", error);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserDataContext.Provider value={{ user, setUser, loading, refreshUser }}>
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
