"use client"

import { useSearchParams } from "next/navigation"
import { ReactNode } from "react"

interface IPage {
	name: string
	page: ReactNode
}

export const PageSwitcher = ({ pages }: { pages: IPage[] }) => {
	const searchParams = useSearchParams()
	const tab = searchParams.get("tab")

	return (
		<>
			{pages.map((page) => (
				<div key={page.name}>{tab === page.name && page.page}</div>
			))}
		</>
	)
}
