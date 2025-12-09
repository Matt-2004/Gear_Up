"use server"

import { Tabs } from "@/components/Admin/Tabs"
import { PageSwitcher } from "@/components/Admin/PageSwticher"

export default async function Page({
	searchParams,
}: {
	searchParams: { tab: string }
}) {
	const { tab } = await searchParams
	console.log("QueryTab:: ", tab)

	return (
		<div className={"flex h-screen w-full text-white"}>
			<div
				className={
					"mx-auto w-1/6 border-r-gray-800 p-2 shadow-sm shadow-gray-700"
				}
			>
				<Tabs selectedTab={tab ?? "dashboard"} />
			</div>
			<div className={"w-5/6"}>
				<PageSwitcher selectedTab={tab ?? "dashboard"} />
			</div>
		</div>
	)
}
