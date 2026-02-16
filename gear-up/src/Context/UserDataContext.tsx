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
    loading: boolean;
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    // Fallback: Fetch user data if not provided but cookies exist
    useEffect(() => {
        if (!initialUser && !user && !loading) {
            setLoading(true);
            fetch("/api/user", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    return null;
                })
                .then((response: IUser | null) => {
                    if (response?.data) {
                        setUser(response.data);
                        console.log("User data fetched via fallback:", response.data);
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch user data in fallback:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [initialUser, user]);

    return (
        <UserDataContext.Provider value={{ user, setUser, loading }}>
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
