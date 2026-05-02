import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { getMyCars } from "@/app/shared/utils/API/CarAPI";
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
import dynamicImport from "next/dynamic";
import { dealerAppointments } from "@/app/shared/utils/API/AppointmentAPI";
import { handleServerError } from "@/app/shared/utils/errors/handleServerError";
import { AppointmentResponse } from "@/app/features/appointments/types/appointment.types";
import { CarModel } from "@/app/features/car/types/car.model";

export const dynamic = "force-dynamic";

const DealerCarDashboardPage = dynamicImport(
  () =>
    import("@/app/features/dashboards/dealer/ui/dealer-dashboard/DealerCarDashboard"),
);
const PostManagementPage = dynamicImport(
  () =>
    import("@/app/features/dashboards/dealer/ui/post-management/PostManagement"),
);
const AppointmentManagementPage = dynamicImport(
  () =>
    import("@/app/features/dashboards/dealer/ui/appointment-management/AppointmentManagement"),
);
const RevenueManagementPage = dynamicImport(
  () =>
    import("@/app/features/dashboards/dealer/ui/revenue-management/RevenueManagement"),
);
const SettingPage = dynamicImport(
  () =>
    import("@/app/features/dashboards/dealer/ui/dealer-profile/DealerProfile"),
);

export async function getAllStatusCars(): Promise<CursorResponse<CarModel[]>> {
  try {
    const [pendingData, approvedData, rejectedData] = await Promise.all([
      getMyCars("Pending", null),
      getMyCars("Approved", null),
      getMyCars("Rejected", null),
    ]);

    const getItems = (response: any): CarModel[] => {
      if (Array.isArray(response?.items)) return response.items;
      if (Array.isArray(response?.data?.items)) return response.data.items;
      if (Array.isArray(response?.data)) return response.data;
      return [];
    };

    // Combine all cars from different statuses into items array
    const allCars: CursorResponse<CarModel[]> = {
      items: [
        ...getItems(approvedData),
        ...getItems(pendingData),
        ...getItems(rejectedData),
      ],
      hasMore: false,
      nextCursor: "",
    };

    console.log("allCars:", allCars);

    // Return in CursorBaseDTO format
    return {
      items: allCars.items,
      hasMore: false,
      nextCursor: "",
    };
  } catch (error) {
    console.error("Error fetching all status cars:", error);
    return {
      items: [],
      hasMore: false,
      nextCursor: "",
    };
  }
}

export async function getAppointment(): Promise<AppointmentResponse> {
  try {
    const res = await dealerAppointments();
    return res;
  } catch (error) {
    handleServerError(error);
    throw error;
  }
}

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
