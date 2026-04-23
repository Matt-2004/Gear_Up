import { CarsCursorDTO } from "@/app/features/car/types/car.types";
import { getMyCars } from "@/utils/API/CarAPI";
import DealerCarDashboard from "../../../features/dashboards/dealer/ui/dealer-dashboard/DealerCarDashboard";

export const dynamic = "force-dynamic";

// Fetch all cars (Pending, Approved, Rejected) and combine into CursorBaseDTO format
export async function getAllStatusCars(): Promise<CarsCursorDTO> {
  try {
    const [pendingData, approvedData, rejectedData] = await Promise.all([
      getMyCars("Pending", null),
      getMyCars("Approved", null),
      getMyCars("Rejected", null),
    ]);

    // Combine all cars from different statuses into items array
    const allCars: CarsCursorDTO = {
      items: [
        ...pendingData?.data.items,
        ...approvedData?.data.items,
        ...rejectedData?.data.items,
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
