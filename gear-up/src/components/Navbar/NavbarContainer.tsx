"use client"

import { ReactNode } from "react"

function NavbarContainer({ children }: { children: ReactNode }) {
	return (
		<div className="bg-primary-background relative flex h-14 max-h-full max-w-screen justify-center">
			<div className="z-20 flex h-full w-full items-center justify-between md:w-full lg:w-[90%] xl:w-[75%]">
				{children}
			</div>
		</div>
	)
}

export default NavbarContainer
