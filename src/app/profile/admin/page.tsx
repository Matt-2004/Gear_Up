import { type PageItem } from "@/app/features/dashboards/admin/ui/dashboard/PageSwitcher";
import AdminPageShell from "@/app/features/dashboards/admin/ui/dashboard/AdminPageShell";
import { Metadata } from "next";
import { getAllKyc } from "@/app/shared/utils/API/AdminAPI";
import { getAllCars } from "@/app/shared/utils/API/AdminAPI";
import {
  ADMIN_TABS,
  AdminTabId,
  DEFAULT_ADMIN_TAB,
} from "@/app/features/dashboards/admin/utils/admin-tab.config";
import dynamicImport from "next/dynamic";
import { CarModel } from "@/app/features/car/types/car.model";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { carMapper } from "@/app/features/car/types/car.mapper";

const AdminDashboardPage = dynamicImport(
  () => import("@/app/features/dashboards/admin/ui/dashboard/AdminDashboard"),
);
const AdminCarVerificationPage = dynamicImport(
  () => import("@/app/features/dashboards/admin/ui/cars/AdminCarVerification"),
);
const AdminKycVerificationPage = dynamicImport(
  () => import("@/app/features/dashboards/admin/ui/kyc/AdminKycVerification"),
);
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard - Gear Up",
  description: "Manage users, dealers, and platform settings.",
};

const getKycData = async () => {
  const res = await getAllKyc();
  return res?.data;
};

const getCarsData = async (): Promise<CursorResponse<CarModel[]>> => {
  const res = await getAllCars(1, 1000); // Fetch cars for verification
  return {
    items: res.data.items.map(carMapper),
    hasMore: res.data.hasMore,
    nextCursor: res.data.nextCursor,
  };
};

export default async function Page() {
  const kyc = await getKycData();
  const cars = await getCarsData();
  const dashboardData = { kyc, cars };

  const pages: PageItem<AdminTabId>[] = [
    {
      id: "dashboard",
      page: <AdminDashboardPage dashboardData={dashboardData} />,
    },
    {
      id: "kyc-verification",
      page: <AdminKycVerificationPage kyc={kyc} />,
    },
    { id: "car-verification", page: <AdminCarVerificationPage cars={cars} /> },
  ];

  return (
    <AdminPageShell
      pages={pages}
      tabs={ADMIN_TABS}
      defaultTabId={DEFAULT_ADMIN_TAB}
    />
  );
}
