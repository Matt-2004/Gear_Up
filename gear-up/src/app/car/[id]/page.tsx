import { CarItems } from "@/app/types/car.types";
import { getCarById } from "@/utils/FetchAPI";
import CarDetailPage from "./CarDetailPage";

async function getData(id: string) {
  try {
    const res = await getCarById(id);
    return res;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const car = (await getData(id)) as CarItems;

  return <CarDetailPage car={car} />;
};

export default Page;
