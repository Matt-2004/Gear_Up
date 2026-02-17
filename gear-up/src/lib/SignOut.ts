"use client"

import { useRouter } from "next/navigation"

export const signOut = async () => {
	const router = useRouter()
	try {
		await fetch("/api/token/remove", {
			method: "POST",
		})
	} finally {
		// Full reload clears all client-side state (useState, caches, etc.)
		window.location.reload()
		router.push("/")
	}
}
