"use client"

import clsx from "clsx"
import { usePathname, useRouter } from "next/navigation"

export const Tabs = ({ selectedTab }: { selectedTab: string }) => {
	const router = useRouter()
	const path = usePathname()
	return (
		<ul
			className={
				"flex w-full flex-col items-start gap-2 [&>ol]:w-full [&>ol]:cursor-pointer [&>ol]:rounded-sm [&>ol]:px-4 [&>ol]:py-2 [&>ol]:hover:border-gray-600 [&>ol]:hover:bg-gray-700"
			}
		>
			<ol
				className={clsx(
					selectedTab === "dashboard" ? "border-gray-600 bg-gray-700" : "",
				)}
				onClick={() => router.replace(`${path}?tab=dashboard`)}
			>
				Dashboard
			</ol>
			<ol
				className={clsx(
					selectedTab === "kyc-verification"
						? "border-gray-600 bg-gray-700"
						: "",
				)}
				onClick={() => router.replace(`${path}?tab=kyc-verification`)}
			>
				Kyc Verification
			</ol>
			<ol
				className={clsx(
					selectedTab === "dealership-verification"
						? "border-gray-600 bg-gray-700"
						: "",
				)}
				onClick={() => router.replace(`${path}?tab=dealership-verification`)}
			>
				Dealership Verification
			</ol>
			<ol
				className={clsx(
					selectedTab === "generate-report"
						? "border-gray-600 bg-gray-700"
						: "",
				)}
				onClick={() => router.replace(`${path}?tab=generate-report`)}
			>
				Generate report
			</ol>
		</ul>
	)
}
