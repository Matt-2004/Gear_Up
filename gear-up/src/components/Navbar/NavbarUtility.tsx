"use client"

import { IUser } from "@/app/types/user.types"
import { Login, SearchBar, User } from "@/components/Navbar/NavUtils"
import NavbarItems from "./NavbarItem"

export default function NavbarUtility({ user }: { user: IUser }) {
	return (
		<div className="flex h-full w-80 items-center justify-end gap-8 px-2 md:w-full md:gap-20">
			<NavbarItems>
				<SearchBar />
			</NavbarItems>

			{user ? <User user={user} /> : <Login />}
		</div>
	)
}
