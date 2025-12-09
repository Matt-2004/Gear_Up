"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export function ConditionalNavbar() {
	const pathname = usePathname()
	const isAdminRoute = pathname?.startsWith("/profile/admin")

	if (isAdminRoute) return null

	return <Navbar />
}
