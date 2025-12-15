"use client"

import { ReactNode } from "react"

function NavbarContainer({ children }: { children: ReactNode }) {
	return (
		<div className="bg-background border-primary relative flex h-12 max-h-full max-w-screen justify-center border-b">
			<div className="z-20 flex h-full w-full items-center justify-between md:w-full lg:w-[90%] xl:w-[75%]">
				{children}
			</div>
		</div>
	)
}

export default NavbarContainer
