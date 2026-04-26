import { PageSwitcher } from "@/app/features/dashboards/admin/ui/dashboard/PageSwitcher";
import { DealerTabs } from "@/app/features/dashboards/dealer/ui/tabs/DealerTabs";
import PostManagement from "@/app/features/dashboards/dealer/ui/post-management/PostManagement";
import RevenueManagement from "@/app/features/dashboards/dealer/ui/review-management/RevenueManagement";
import Setting from "@/app/features/dashboards/dealer/ui/dealer-profile/DealerProfile";
import TestDriveManagement from "@/app/features/dashboards/dealer/ui/appiontment-management/AppointmentManagement";
import DealerCarDashboard from "../../features/dashboards/dealer/ui/dealer-dashboard/DealerCarDashboard";
import { getAllStatusCars } from "./cars/page";
import { Metadata } from "next";
import {
  DEALER_TABS,
  type DealerTabId,
} from "@/app/features/dashboards/dealer/utils/dealer-tabs.config";
import { AdminTabId } from "@/app/features/dashboards/admin/utils/admin-tab.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dealer Dashboard - Gear Up",
  description:
    "Manage your dealership, listings, and appointments from your dashboard.",
};

export interface PageItem {
  id: DealerTabId | AdminTabId;
  page: React.ReactNode;
}

export default async function Page() {
  const carData = await getAllStatusCars();

  const pages: PageItem[] = [
    {
      id: "car-management",
      page: <DealerCarDashboard carData={carData} />,
    },
    {
      id: "post-management",
      page: <PostManagement />,
    },
    {
      id: "test-drive-management",
      page: <TestDriveManagement />,
    },
    {
      id: "revenue-management",
      page: <RevenueManagement />,
    },
    {
      id: "setting",
      page: <Setting />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="relative mx-auto w-full">
        <div className="border-t border-b border-gray-200 bg-white shadow-sm md:border">
          <div className="sticky top-17 z-10 border-b border-gray-200 bg-white">
            <DealerTabs tabs={DEALER_TABS} />
          </div>

          <div className="w-full bg-gray-50/20 p-0 md:p-6">
            <PageSwitcher pages={pages} />
          </div>
        </div>
      </div>
    </div>
  );
}
