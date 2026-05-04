import { redirect } from "next/navigation";
import EditCarForm from "../../../../../features/profiles/dealer/ui/edit-car-form/EditCarForm";
import { getCarById } from "@/app/shared/utils/API/CarAPI";
import { handleServerError } from "@/app/shared/utils/errors/handleServerError";
import { CarDetailModel } from "@/app/features/car/types/car.model";
import { carDetailMapper } from "@/app/features/car/types/car.mapper";

async function fetchCarData(carId: string): Promise<CarDetailModel> {
  try {
    const result = await getCarById(carId);
    const carDetail = carDetailMapper(result.data);
    return carDetail;
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
