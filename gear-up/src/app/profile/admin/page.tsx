"use server";

import AdminDashboard from "@/components/Admin/AdminDashboard";
import AdminDealershipVerification from "@/components/Admin/AdminDealershipVerification";
import AdminGenerateReport from "@/components/Admin/AdminGenerateReport";
import AdminKycVerification from "@/components/Admin/AdminKycVerification";
import { PageSwitcher } from "@/components/Admin/PageSwitcher";
import { Tabs } from "@/components/Admin/Tabs";
import { getAllCars, getAllKyc } from "@/utils/API/AdminAPI";

const getKycData = async () => {
  const res = await getAllKyc();
  return res?.data;
};

const getDashboardData = async () => {
  try {
    const [kycRes, carsRes] = await Promise.all([
      getAllKyc(),
      getAllCars(1, 100), // Fetch first 100 cars for stats
    ]);

    return {
      kyc: kycRes?.data,
      cars: carsRes?.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      kyc: null,
      cars: null,
    };
  }
};

export default async function Page() {
  const kyc = await getKycData();
  const dashboardData = await getDashboardData();
  const tabs = [
    { name: "Dashboard", path: "?tab=dashboard" },
    { name: "Kyc Verification", path: "?tab=kyc-verification" },
    { name: "Dealer Verification", path: "?tab=dealer-verification" },
    { name: "Generate Report", path: "?tab=generate-report" },
  ];

  const pages = [
    {
      name: "dashboard",
      page: <AdminDashboard dashboardData={dashboardData} />,
    },
    {
      name: "kyc-verification",
      page: <AdminKycVerification kyc={kyc} />,
    },
    { name: "dealer-verification", page: <AdminDealershipVerification /> },
    { name: "generate-report", page: <AdminGenerateReport /> },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-64 p-4">
        <Tabs tabs={tabs} />
      </div>
      <div className="flex-1">
        <PageSwitcher pages={pages} />
      </div>
    </div>
  );
}
