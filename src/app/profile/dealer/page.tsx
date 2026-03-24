import { PageSwitcher } from "@/components/Admin/PageSwitcher";
import { DealerTabs } from "@/components/Dealer/DealerTabs";
import CarManagement from "@/components/Dealer/Car/CarManagement";
import Dashboard from "@/components/Dealer/Dashboard";
import PostManagement from "@/components/Dealer/Post/PostManagement";
import RevenueManagement from "@/components/Dealer/Revenue/RevenueManagement";
import Setting from "@/components/Dealer/Setting";
import TestDriveManagement from "@/components/Dealer/TestDrive/TestDriveManagement";
import { getReviewByDealerIdWithSummary } from "@/utils/API/ReviewAPI";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dealer Dashboard - Gear Up",
  description:
    "Manage your dealership, listings, and appointments from your dashboard.",
};

export default async function Page() {
  const userId = (await cookies()).get("user_id")?.value as string;
  void getReviewByDealerIdWithSummary(userId);

  const tabs = [
    { name: "Dashboard", path: "?tab=dashboard" },
    { name: "Car Management", path: "?tab=car-management" },
    { name: "Post Management", path: "?tab=post-management" },
    { name: "Test Drive Management", path: "?tab=test-drive-management" },
    { name: "Revenue Management", path: "?tab=revenue-management" },

    { name: "Setting", path: "?tab=setting" },
  ];

  const pages = [
    { name: "dashboard", page: <Dashboard /> },
    { name: "car-management", page: <CarManagement /> },
    { name: "post-management", page: <PostManagement /> },
    { name: "test-drive-management", page: <TestDriveManagement /> },
    { name: "revenue-management", page: <RevenueManagement /> },
    { name: "setting", page: <Setting /> },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto w-full max-w-400 md:px-6 md:py-6">
        <div className="border-t border-b md:border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
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
