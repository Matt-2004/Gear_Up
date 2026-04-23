import AdminCarVerification from "@/app/features/dashboards/admin/ui/cars/AdminCarVerification";
import AdminDashboard from "@/app/features/dashboards/admin/ui/dashboard/AdminDashboard";

import AdminKycVerification from "@/app/features/dashboards/admin/ui/kyc/AdminKycVerification";
import { PageSwitcher } from "@/app/features/dashboards/admin/ui/dashboard/PageSwitcher";
import { Tabs } from "@/app/features/dashboards/admin/ui/dashboard/Tabs";
import { getAllCars, getAllKyc } from "@/utils/API/AdminAPI";
import { Metadata } from "next";

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
  const tabs = [
    { name: "Dashboard", path: "?tab=dashboard" },
    { name: "Kyc Verification", path: "?tab=kyc-verification" },
    { name: "Car Verification", path: "?tab=car-verification" },
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
    { name: "car-verification", page: <AdminCarVerification cars={cars} /> },
  ];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-64 p-4">
        <Tabs name="Admin" tabs={tabs} />
      </div>
      <div className="flex-1">
        <PageSwitcher pages={pages} />
      </div>
    </div>
  );
}
