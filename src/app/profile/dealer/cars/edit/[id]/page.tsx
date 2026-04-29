import { CarItems } from "@/app/features/car/types/car.types";
import { redirect } from "next/navigation";
import EditCarForm from "../../../../../features/dashboards/dealer/ui/edit-car-form/EditCarForm";
import { getCarById } from "@/app/shared/utils/API/CarAPI";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { handleServerError } from "@/app/shared/utils/errors/handleServerError";

async function fetchCarData(carId: string): Promise<CarItems> {
  try {
    const result = await getCarById(carId);
    console.log("result of car edit", result);
    return result.data;
  } catch (error) {
    handleServerError(error);
    throw error;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const carId = (await params).id;

  const carData = await fetchCarData(carId);

  if (!carData) {
    redirect("/profile/dealer?tab=car-management");
  }

  return <EditCarForm initialData={carData} />;
};

export default Page;
