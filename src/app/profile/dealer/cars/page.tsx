import { getMyCars } from "@/app/shared/utils/API/CarAPI";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CarModel } from "@/app/features/car/types/car.model";
import { carMapper } from "@/app/features/car/types/car.mapper";
import DealerCarDashboard from "@/app/features/profiles/dealer/ui/dealer-dashboard/DealerCarDashboard";

export const dynamic = "force-dynamic";

// Fetch all cars (Pending, Approved, Rejected) and combine into CursorBaseDTO format
export async function getAllStatusCars(): Promise<CursorResponse<CarModel[]>> {
  try {
    const [pendingData, approvedData, rejectedData] = await Promise.all([
      getMyCars("Pending", null),
      getMyCars("Approved", null),
      getMyCars("Rejected", null),
    ]);

    // Combine all cars from different statuses into items array
    const allCars: CursorResponse<CarModel[]> = {
      items: [
        ...pendingData?.data.items.map(carMapper),
        ...approvedData?.data.items.map(carMapper),
        ...rejectedData?.data.items.map(carMapper),
      ],
      hasMore: false,
      nextCursor: "",
    };

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
