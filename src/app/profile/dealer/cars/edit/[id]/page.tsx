import { CarItems } from "@/types/car.types";
import { getCarById } from "@/utils/API/CarAPI";
import { redirect } from "next/navigation";
import EditCarForm from "./EditCarForm";

export const dynamic = "force-dynamic";

async function fetchCarData(carId: string): Promise<CarItems | null> {
  try {
    const result = await getCarById(carId);
    console.log("Fetching car data: ", result);
    return result?.data;
  } catch (err: any) {
    console.error("Error fetching car data:", err);
    return null;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const carId = (await params).id;
  console.log("Car ID from params:", carId);
  const carData = await fetchCarData(carId);

  if (!carData) {
    redirect("/profile/dealer/cars");
  }

  return <EditCarForm initialData={carData} />;
};

export default Page;
