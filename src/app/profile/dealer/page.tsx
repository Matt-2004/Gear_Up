import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { getMyCars } from "@/app/shared/utils/API/CarAPI";
import {
  type PageItem,
  PageSwitcher,
} from "@/app/features/profiles/admin/ui/dashboard/PageSwitcher";
import { DealerTabs } from "@/app/features/profiles/dealer/ui/tabs/DealerTabs";
import { Metadata } from "next";
import {
  DEALER_TABS,
  DealerTabId,
  DEFAULT_DEALER_TAB,
} from "@/app/features/profiles/dealer/utils/dealer-tabs.config";
import dynamicImport from "next/dynamic";
import { dealerAppointments } from "@/app/shared/utils/API/AppointmentAPI";
import { handleServerError } from "@/app/shared/utils/errors/handleServerError";
import { CarModel } from "@/app/features/car/types/car.model";
import { carMapper } from "@/app/features/car/types/car.mapper";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { CarDTO } from "@/app/features/car/types/car.dto";
import { AppointmentResponse } from "@/app/features/appointments/types/appointment.dto";
import { AppointmentModel } from "@/app/features/appointments/types/appointment.model";
import { AppointmentMapper } from "@/app/features/appointments/types/appointment.mapper";

export const dynamic = "force-dynamic";

const DealerCarDashboardPage = dynamicImport(
  () =>
    import("@/app/features/profiles/dealer/ui/dealer-dashboard/DealerCarDashboard"),
);
const PostManagementPage = dynamicImport(
  () =>
    import("@/app/features/profiles/dealer/ui/post-management/PostManagement"),
);
const AppointmentManagementPage = dynamicImport(
  () =>
    import("@/app/features/profiles/dealer/ui/appointment-management/AppointmentManagement"),
);
const RevenueManagementPage = dynamicImport(
  () =>
    import("@/app/features/profiles/dealer/ui/revenue-management/RevenueManagement"),
);
const SettingPage = dynamicImport(
  () =>
    import("@/app/features/profiles/dealer/ui/dealer-profile/DealerProfile"),
);

export async function getAllStatusCars(): Promise<CursorResponse<CarModel[]>> {
  try {
    const [pendingData, approvedData, rejectedData] = await Promise.all([
      getMyCars("Pending", null),
      getMyCars("Approved", null),
      getMyCars("Rejected", null),
    ]);

    const getItems = (
      response: MainResponse<CursorResponse<CarDTO[]>>,
    ): CarModel[] => {
      return response.data.items.map(carMapper);
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
  const appointmentData = await getAppointment();
  const appointment: CursorResponse<AppointmentModel[]> = {
    items: appointmentData.data.items.map(AppointmentMapper),
    hasMore: appointmentData.data.hasMore,
    nextCursor: appointmentData.data.nextCursor,
  };

  const pages: PageItem<DealerTabId>[] = [
    {
      id: "car-management",
      page: <DealerCarDashboardPage carData={carData} />,
    },
    {
      id: "post-management",
      page: <PostManagementPage />,
    },
    {
      id: "appointment-management",
      page: <AppointmentManagementPage appointmentData={appointment} />,
    },
    {
      id: "revenue-management",
      page: <RevenueManagementPage />,
    },
    {
      id: "setting",
      page: <SettingPage />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className=" mx-auto w-full">
        <div className="border-t border-b border-gray-200 bg-white shadow-sm md:border">
          <div className="sticky top-16.5 z-10 border-b border-gray-200 bg-white">
            <DealerTabs tabs={DEALER_TABS} />
          </div>

          <div className="w-full bg-gray-50/20">
            <PageSwitcher pages={pages} defaultPageId={DEFAULT_DEALER_TAB} />
          </div>
        </div>
      </div>
    </div>
  );
}
