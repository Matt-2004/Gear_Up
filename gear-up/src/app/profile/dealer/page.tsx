import { PageSwitcher } from "@/components/Admin/PageSwitcher"
import { Tabs } from "@/components/Admin/Tabs"
import CarManagement from "@/components/Dealer/Car/CarManagement"
import Dashboard from "@/components/Dealer/Dashboard"
import PostManagement from "@/components/Dealer/Post/PostManagement"
import RevenueManagement from "@/components/Dealer/Revenue/RevenueManagement"
import Setting from "@/components/Dealer/Setting"
import TestDriveManagement from "@/components/Dealer/TestDrive/TestDriveManagement"
import { getReviewByDealerIdWithSummary } from "@/utils/API/ReviewAPI"
import { Metadata } from "next"
import { cookies } from "next/headers"

export const metadata: Metadata = {
	title: "Dealer Dashboard - Gear Up",
	description: "Manage your dealership, listings, and appointments from your dashboard.",
}

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
		<div className={"flex flex-col lg:flex-row min-h-screen w-full text-white"}>
			{/* Sidebar - Hidden on mobile, shown as drawer or full width on small screens */}
			<div className={"w-full lg:w-1/5 lg:min-w-64 p-2 lg:shadow-md lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"}>
				<Tabs name="Dealer" tabs={tabs} />
			</div>
			{/* Main content area */}
			<div className={"w-full lg:w-4/5 p-2 lg:p-4 overflow-x-hidden"}>
				<PageSwitcher pages={pages} />
			</div>
		</div>
	)
}


