"use client"

import { ReactNode } from "react"

function NavbarContainer({ children }: { children: ReactNode }) {
	return (
		<div className="bg-foreground relative flex h-16 w-full justify-center border-b border-[#7ED957]">
			<div className="z-20 flex h-16 w-full items-center justify-between object-fill md:w-full lg:w-[90%] xl:w-[75%]">
				{children}
			</div>
		</div>
	)
}

export default NavbarContainer
