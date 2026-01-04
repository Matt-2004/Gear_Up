"use client"

import { IUser } from "@/app/types/user.types"
import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

const ConditionalNavbar = ({ user }: { user: IUser }) => {
	const currentPath = usePathname()

	if (currentPath === "/profile/admin") {
		return null
	}
	return <Navbar user={user} />
}

export default ConditionalNavbar
