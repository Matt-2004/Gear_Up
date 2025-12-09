"use client"

import NavbarItems from "@/components/Navbar/NavbarItem"
import { Login, SearchBar, User } from "@/components/Navbar/NavUtils"
import { handleAuthenticationLogin } from "@/lib/Features/authSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { getRefreshToken } from "@/utils/getRefreshToken"
import { useEffect } from "react"

export default function NavbarUtility() {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
	const dispatch = useAppDispatch()

	useEffect(() => {
		// Check Refresh_token exist or not
		const tokenCheck = async () => {
			const refreshToken = await getRefreshToken()
			// if refresh_token exist have to assume logged in
			if (refreshToken) {
				// set isAuthenticate to True
				dispatch(handleAuthenticationLogin())
			}
		}
		tokenCheck()
	})

	return (
		<div className="flex h-full w-80 items-center justify-end gap-4 md:w-full md:gap-20">
			<NavbarItems>
				<SearchBar />
			</NavbarItems>

			<NavbarItems>{isAuthenticated ? <User /> : <Login />}</NavbarItems>
		</div>
	)
}
