"use client"

import { IUser } from "@/app/types/user.types"
import NavbarUtility from "@/components/Navbar/NavbarUtility"
import { Logo } from "./NavUtils"
import NavbarContainer from "./NavbarContainer"
import NavbarTabs from "./NavbarTabs"

export default function Navbar({ user }: { user: IUser }) {
	return (
		<NavbarContainer>
			<Logo />
			<div className="hidden md:block">
				<NavbarTabs />
			</div>
			<NavbarUtility user={user} />
		</NavbarContainer>
	)
}
