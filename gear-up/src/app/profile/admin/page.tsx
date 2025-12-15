"use server"

import AdminDashboard from "@/components/Admin/AdminDashboard"
import AdminDealershipVerification from "@/components/Admin/AdminDealershipVerification"
import AdminGenerateReport from "@/components/Admin/AdminGenerateReport"
import AdminKycVerification from "@/components/Admin/AdminKycVerification"
import { PageSwitcher } from "@/components/Admin/PageSwitcher"
import { Tabs } from "@/components/Admin/Tabs"

export default async function Page({
	searchParams,
}: {
	searchParams: { tab: string }
}) {
	const { tab } = await searchParams

	const tabs = [
		{ name: "Dashboard", path: "?tab=dashboard" },
		{ name: "Kyc Verification", path: "?tab=kyc-verification" },
		{ name: "Dealer Verification", path: "?tab=dealer-verification" },
		{ name: "Generate Report", path: "?tab=generate-report" },
	]

	const pages = [
		{ name: "dashboard", page: <AdminDashboard /> },
		{ name: "kyc-verification", page: <AdminKycVerification /> },
		{ name: "dealer-verification", page: <AdminDealershipVerification /> },
		{ name: "generate-report", page: <AdminGenerateReport /> },
	]

	return (
		<div className={"flex h-screen w-full text-white"}>
			<div className={"mx-auto w-1/6 p-2 shadow-md"}>
				<Tabs tabs={tabs} />
			</div>
			<div className={"w-5/6"}>
				<PageSwitcher pages={pages} />
			</div>
		</div>
	)
}
