"use client"

import { UserItem } from "@/types/user.types"
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"

interface UserDataContextType {
	user: UserItem | null
	loading: boolean
}

const UserDataContext = createContext<UserDataContextType | undefined>(
	undefined,
)

export function UserDataContextProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserItem | null>(null)
	const [loading, setLoading] = useState(false)

	async function getEncryptedUserData() {
		const res = await fetch("/api/user")
		const response = await res.json()
		return response
	}

	useEffect(() => {
		async function fetchUserData() {
			const userDataDecrypted = await getEncryptedUserData()
			setUser(userDataDecrypted.data)
		}
		fetchUserData()
	}, [])

	return (
		<UserDataContext.Provider value={{ user, loading }}>
			{children}
		</UserDataContext.Provider>
	)
}

export function UserDataProvider({ children }: { children: ReactNode }) {
	return <UserDataContextProvider>{children}</UserDataContextProvider>
}

export function useUserData() {
	const context = useContext(UserDataContext)
	if (context === undefined) {
		throw new Error("useUserData must be used within a UserDataProvider")
	}
	return context
}
