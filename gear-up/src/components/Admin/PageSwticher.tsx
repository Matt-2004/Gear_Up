import AdminDashboard from "@/components/Admin/AdminDashboard"
import AdminKycVerification from "@/components/Admin/AdminKycVerification"
import AdminDealershipVerification from "@/components/Admin/AdminDealershipVerification"
import AdminGenerateReport from "@/components/Admin/AdminGenerateReport"
import FilterProvider from "@/Context/AdminKycFilterContext"

export const PageSwitcher = ({ selectedTab }: { selectedTab: string }) => {
	return (
		<>
			{selectedTab === "dashboard" && <AdminDashboard />}
			{selectedTab === "kyc-verification" && (
				<FilterProvider>
					<AdminKycVerification />
				</FilterProvider>
			)}
			{selectedTab === "dealership-verification" && (
				<AdminDealershipVerification />
			)}
			{selectedTab === "generate-report" && <AdminGenerateReport />}
		</>
	)
}
