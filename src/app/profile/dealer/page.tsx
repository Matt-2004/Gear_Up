import { PageSwitcher } from "@/components/Admin/PageSwitcher";
import { DealerTabs } from "@/components/Dealer/DealerTabs";
import PostManagement from "@/components/Dealer/Post/PostManagement";
import RevenueManagement from "@/components/Dealer/Revenue/RevenueManagement";
import Setting from "@/components/Dealer/Setting";
import TestDriveManagement from "@/components/Dealer/TestDrive/TestDriveManagement";
import { Metadata } from "next";
import DealerCarDashboard from "./cars/DealerCarDashboard";
import { getAllStatusCars } from "./cars/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dealer Dashboard - Gear Up",
  description:
    "Manage your dealership, listings, and appointments from your dashboard.",
};

export default async function Page() {
  const carData = await getAllStatusCars();

  const tabs = [
    { name: "Car Management", path: "?tab=car-management" },
    { name: "Post Management", path: "?tab=post-management" },
    { name: "Appointment Management", path: "?tab=test-drive-management" },
    { name: "Revenue Management", path: "?tab=revenue-management" },

    { name: "Setting", path: "?tab=setting" },
  ];

  const pages = [
    { name: "car-management", page: <DealerCarDashboard carData={carData} /> },
    { name: "post-management", page: <PostManagement /> },
    { name: "test-drive-management", page: <TestDriveManagement /> },
    { name: "revenue-management", page: <RevenueManagement /> },
    { name: "setting", page: <Setting /> },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto w-full relative">
        <div className="border-t border-b md:border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white sticky top-[68px] z-10">
            <DealerTabs tabs={tabs} />
          </div>

          {/* Main content area */}
          <div className="w-full  bg-gray-50/20 p-0 md:p-6">
            <PageSwitcher pages={pages} />
          </div>
        </div>
      </div>
    </div>
  );
}
