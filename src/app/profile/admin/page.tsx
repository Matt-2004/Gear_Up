import AdminCarVerification from "@/app/features/dashboards/admin/ui/cars/AdminCarVerification";
import AdminDashboard from "@/app/features/dashboards/admin/ui/dashboard/AdminDashboard";
import AdminKycVerification from "@/app/features/dashboards/admin/ui/kyc/AdminKycVerification";
import {
  type PageItem,
  PageSwitcher,
} from "@/app/features/dashboards/admin/ui/dashboard/PageSwitcher";
import { AdminTabs } from "@/app/features/dashboards/admin/ui/dashboard/AdminTabs";
import { Metadata } from "next";
import { getAllKyc } from "@/app/shared/utils/API/AdminAPI";
import { getAllCars } from "@/app/shared/utils/API/AdminAPI";

import {
  ADMIN_TABS,
  AdminTabId,
  DEFAULT_ADMIN_TAB,
  isAdminTabId,
} from "@/app/features/dashboards/admin/utils/admin-tab.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard - Gear Up",
  description: "Manage users, dealers, and platform settings.",
};

const getKycData = async () => {
  const res = await getAllKyc();
  return res?.data;
};

const getCarsData = async () => {
  const res = await getAllCars(1, 1000); // Fetch cars for verification
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
  const cars = await getCarsData();
  const dashboardData = await getDashboardData();

  const pages: PageItem<AdminTabId>[] = [
    {
      id: "dashboard",
      page: <AdminDashboard dashboardData={dashboardData} />,
    },
    {
      id: "kyc-verification",
      page: <AdminKycVerification kyc={kyc} />,
    },
    { id: "car-verification", page: <AdminCarVerification cars={cars} /> },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-64 p-4">
        <AdminTabs tabs={ADMIN_TABS} />
      </div>
      <div className="flex-1">
        <PageSwitcher pages={pages} defaultPageId={DEFAULT_ADMIN_TAB} />
      </div>
    </div>
  );
}
