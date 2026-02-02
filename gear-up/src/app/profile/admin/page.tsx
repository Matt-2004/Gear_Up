"use server"

import AdminDashboard from "@/components/Admin/AdminDashboard"
import AdminDealershipVerification from "@/components/Admin/AdminDealershipVerification"
import AdminGenerateReport from "@/components/Admin/AdminGenerateReport"
import AdminKycVerification from "@/components/Admin/AdminKycVerification"
import { PageSwitcher } from "@/components/Admin/PageSwitcher"
import { Tabs } from "@/components/Admin/Tabs"
import { getAllKyc } from "@/utils/API/AdminAPI"

const getKycData = async () => {
	const res = await getAllKyc()
	return res?.data
}

export default async function Page() {
	const kyc = await getKycData()
	console.log(kyc)
	const tabs = [
		{ name: "Dashboard", path: "?tab=dashboard" },
		{ name: "Kyc Verification", path: "?tab=kyc-verification" },
		{ name: "Dealer Verification", path: "?tab=dealer-verification" },
		{ name: "Generate Report", path: "?tab=generate-report" },
	]

	const pages = [
		{ name: "dashboard", page: <AdminDashboard /> },
		{ name: "kyc-verification", page: <AdminKycVerification kyc={kyc} /> },
		{ name: "dealer-verification", page: <AdminDealershipVerification /> },
		{ name: "generate-report", page: <AdminGenerateReport /> },
	]

	return (
		<div className={"flex h-screen w-full text-gray-500"}>
			<div className={"mx-auto w-1/6 p-2 shadow-md"}>
				<Tabs tabs={tabs} />
			</div>
			<div className={"w-5/6"}>
				<PageSwitcher pages={pages} />
			</div>
		</div>
	)
}
