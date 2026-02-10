"use server"

import { PageSwitcher } from "@/components/Admin/PageSwitcher"
import { Tabs } from "@/components/Admin/Tabs"
import CarManagement from "@/components/Dealer/Car/CarManagement"
import Dashboard from "@/components/Dealer/Dashboard"
import PostManagement from "@/components/Dealer/Post/PostManagement"
import RevenueManagement from "@/components/Dealer/Revenue/RevenueManagement"
import Setting from "@/components/Dealer/Setting"
import TestDriveManagement from "@/components/Dealer/TestDrive/TestDriveManagement"
import { getReviewByDealerIdWithSummary } from "@/utils/API/ReviewAPI"
import { cookies } from "next/headers"


export default async function Page() {

	const userId = (await cookies()).get("user_id")?.value as string
	const fetchAll = async () => {
		Promise.all([getReviewByDealerIdWithSummary(userId)])
		// Rating summary
		// My cars
		// Appointment summary
	}

	const tabs = [
		{ name: "Dashboard", path: "?tab=dashboard" },
		{ name: "Car Management", path: "?tab=car-management" },
		{ name: "Post Management", path: "?tab=post-management" },
		{ name: "Test Drive Management", path: "?tab=test-drive-management" },
		{ name: "Revenue Management", path: "?tab=revenue-management" },
		{ name: "Setting", path: "?tab=setting" },
	]

	const pages = [
		{ name: "dashboard", page: <Dashboard /> },
		{ name: "car-management", page: <CarManagement /> },
		{ name: "post-management", page: <PostManagement /> },
		{ name: "test-drive-management", page: <TestDriveManagement /> },
		{ name: "revenue-management", page: <RevenueManagement /> },
		{ name: "setting", page: <Setting /> },
	]

	return (
		<div className={"flex h-screen w-full text-white"}>
			<div className={"mx-auto w-1/5 p-2 shadow-md"}>
				<Tabs name="Dealer" tabs={tabs} />
			</div>
			<div className={"w-5/6"}>
				<PageSwitcher pages={pages} />
			</div>
		</div>
	)
}


