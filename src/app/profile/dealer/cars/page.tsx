import { CarItems } from "@/app/features/car/types/car.types";
import { getMyCars } from "@/app/shared/utils/API/CarAPI";
import DealerCarDashboard from "../../../features/dashboards/dealer/ui/dealer-dashboard/DealerCarDashboard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

export const dynamic = "force-dynamic";

// Fetch all cars (Pending, Approved, Rejected) and combine into CursorBaseDTO format
export async function getAllStatusCars(): Promise<CursorResponse<CarItems[]>> {
  try {
    const [pendingData, approvedData, rejectedData] = await Promise.all([
      getMyCars("Pending", null),
      getMyCars("Approved", null),
      getMyCars("Rejected", null),
    ]);

    const getItems = (response: any): CarItems[] => {
      if (Array.isArray(response?.items)) return response.items;
      if (Array.isArray(response?.data?.items)) return response.data.items;
      if (Array.isArray(response?.data)) return response.data;
      return [];
    };

    // Combine all cars from different statuses into items array
    const allCars: CursorResponse<CarItems[]> = {
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

const Page = async () => {
  const cars = await getAllStatusCars();

  return <DealerCarDashboard carData={cars} />;
};

export default Page;
