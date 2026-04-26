import {
  type PageItem,
  PageSwitcher,
} from "@/app/features/dashboards/admin/ui/dashboard/PageSwitcher";
import { DealerTabs } from "@/app/features/dashboards/dealer/ui/tabs/DealerTabs";
import PostManagement from "@/app/features/dashboards/dealer/ui/post-management/PostManagement";
import RevenueManagement from "@/app/features/dashboards/dealer/ui/review-management/RevenueManagement";
import Setting from "@/app/features/dashboards/dealer/ui/dealer-profile/DealerProfile";
import DealerCarDashboard from "../../features/dashboards/dealer/ui/dealer-dashboard/DealerCarDashboard";
import { getAllStatusCars } from "./cars/page";
import { Metadata } from "next";
import {
  DEALER_TABS,
  DealerTabId,
  DEFAULT_DEALER_TAB,
} from "@/app/features/dashboards/dealer/utils/dealer-tabs.config";

import AppointmentManagement from "@/app/features/dashboards/dealer/ui/appiontment-management/AppointmentManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dealer Dashboard - Gear Up",
  description:
    "Manage your dealership, listings, and appointments from your dashboard.",
};

export default async function Page() {
  const carData = await getAllStatusCars();
  console.log("carData sending from :", carData);

  const pages: PageItem<DealerTabId>[] = [
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
      page: <AppointmentManagement />,
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
            <PageSwitcher pages={pages} defaultPageId={DEFAULT_DEALER_TAB} />
          </div>
        </div>
      </div>
    </div>
  );
}
