"use client"

import { IUser } from "@/app/types/user.types"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

const ConditionalNavbar = ({ user }: { user: IUser }) => {
	const currentPath = usePathname()

	const listPath = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/profile/admin"]

	if (listPath.includes(currentPath)) {
		return null
	}
	return <Navbar user={user} />
}

export default ConditionalNavbar
