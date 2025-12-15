"use client"

import { Login, SearchBar, User } from "@/components/Navbar/NavUtils"
import { handleAuthenticationLogin } from "@/lib/Features/authSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { getRefreshToken } from "@/utils/getRefreshToken"
import { useEffect } from "react"
import NavbarItems from "./NavbarItem"

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
		<div className="flex h-full w-80 items-center justify-end gap-8 px-2 md:w-full md:gap-20">
			<NavbarItems>
				<SearchBar />
			</NavbarItems>

			{isAuthenticated ? <User /> : <Login />}
		</div>
	)
}
