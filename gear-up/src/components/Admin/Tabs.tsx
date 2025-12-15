"use client"

import clsx from "clsx"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

interface ITab {
	name: string
	path: string
}

export const Tabs = ({ tabs }: { tabs: ITab[] }) => {
	const router = useRouter()
	const path = usePathname()
	const [selectedTab, setSelectedtab] = useState<string>("dashboard")

	const strToUrl = (tabName: string) => {
		return (
			tabName.toLocaleLowerCase().split(" ")[0] +
			"-" +
			tabName.toLocaleLowerCase().split(" ")[1]
		)
	}

	const handleTab = (tabPath: string, tabName: string) => {
		setSelectedtab(strToUrl(tabName))
		router.replace(`${path}${tabPath}`)
	}

	return (
		<>
			<ul
				className={
					"text-primary [&>ol]:hover:bg-primary-background flex w-full flex-col items-start gap-2 [&>ol]:w-full [&>ol]:cursor-pointer [&>ol]:rounded-sm [&>ol]:px-4 [&>ol]:py-2 [&>ol]:hover:border-gray-600"
				}
			>
				{tabs.map((tab) => (
					<ol
						key={tab.name}
						className={clsx(
							selectedTab === strToUrl(tab.name) && "bg-primary-background",
						)}
						onClick={() => handleTab(tab.path, tab.name)}
					>
						{tab.name}
					</ol>
				))}
			</ul>
		</>
		// <ul
		// 	className={
		// 		"text-primary [&>ol]:hover:bg-primary-background flex w-full flex-col items-start gap-2 [&>ol]:w-full [&>ol]:cursor-pointer [&>ol]:rounded-sm [&>ol]:px-4 [&>ol]:py-2 [&>ol]:hover:border-gray-600"
		// 	}
		// >
		// 	<ol
		// 		className={clsx(
		// 			selectedTab === "dashboard" ? "bg-primary-background" : "",
		// 		)}
		// 		onClick={() => router.replace(`${path}?tab=dashboard`)}
		// 	>
		// 		Dashboard
		// 	</ol>
		// 	<ol
		// 		className={clsx(
		// 			selectedTab === "kyc-verification" ? "bg-primary-background" : "",
		// 		)}
		// 		onClick={() => router.replace(`${path}?tab=kyc-verification`)}
		// 	>
		// 		Kyc Verification
		// 	</ol>
		// 	<ol
		// 		className={clsx(
		// 			selectedTab === "dealership-verification"
		// 				? "bg-primary-background"
		// 				: "",
		// 		)}
		// 		onClick={() => router.replace(`${path}?tab=dealership-verification`)}
		// 	>
		// 		Dealership Verification
		// 	</ol>
		// 	<ol
		// 		className={clsx(
		// 			selectedTab === "generate-report" ? "bg-primary-background" : "",
		// 		)}
		// 		onClick={() => router.replace(`${path}?tab=generate-report`)}
		// 	>
		// 		Generate report
		// 	</ol>
		// </ul>
	)
}
