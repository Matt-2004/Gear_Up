"use client"

import NavbarUtility from "@/components/Navbar/NavbarUtility"
import { Logo } from "./NavUtils"
import NavbarContainer from "./NavbarContainer"
import NavbarTabs from "./NavbarTabs"

export default function Navbar({ isAuth }: { isAuth: boolean }) {
	return (
		<NavbarContainer>
			<Logo />
			<div className="hidden md:block">
				<NavbarTabs />
			</div>
			<NavbarUtility isAuth={isAuth} />
		</NavbarContainer>
	)
}
