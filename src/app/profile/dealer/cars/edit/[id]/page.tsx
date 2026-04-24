import { CarItems } from "@/app/features/car/types/car.types";
import { redirect } from "next/navigation";
import EditCarForm from "../../../../../features/dashboards/dealer/ui/edit-car-form/EditCarForm";
import { getCarById } from "@/app/shared/utils/API/CarAPI";

export const dynamic = "force-dynamic";

async function fetchCarData(carId: string): Promise<CarItems | null> {
  try {
    const result = await getCarById(carId);

    return result?.data;
  } catch (err: any) {
    console.error("Error fetching car data:", err);
    return null;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const carId = (await params).id;

  const carData = await fetchCarData(carId);

  if (!carData) {
    redirect("/profile/dealer/cars");
  }

  return <EditCarForm initialData={carData} />;
};

export default Page;
