"use client"

import { IUserData } from "@/app/types/user.types"
import { createContext, ReactNode, useContext, useState } from "react"

interface UserDataContextType {
    user: IUserData | null
    setUser: (user: IUserData | null) => void
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({
    children,
    initialUser,
}: {
    children: ReactNode
    initialUser: IUserData | null
}) {
    const [user, setUser] = useState<IUserData | null>(initialUser)

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    )
}

export function useUserData() {
    const context = useContext(UserDataContext)
    if (context === undefined) {
        throw new Error("useUserData must be used within a UserDataProvider")
    }
    return context
}
