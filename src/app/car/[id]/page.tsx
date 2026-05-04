import { getCarById } from "@/app/shared/utils/API/CarAPI";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CarDetail from "../../features/car/ui/car-detail/CarDetail";
import { carDetailMapper } from "@/app/features/car/types/car.mapper";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const car = await getCarById(id);
    const carData = car.data;
    return {
      title: carData
        ? `${carData.make} ${carData.model} ${carData.year} - Gear Up`
        : "Car Details - Gear Up",
      description: carData
        ? `${carData.title} - ${carData.description?.substring(0, 150)}`
        : "View car details on Gear Up",
    };
  } catch {
    return {
      title: "Car Details - Gear Up",
      description: "View car details on Gear Up",
    };
  }
}

async function getData(id: string) {
  try {
    const res = await getCarById(id);
    const carDetail = carDetailMapper(res.data);
    return carDetail;
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const car = await getData(id);

  if (!car) notFound();

  return <CarDetail car={car} />;
};

export default Page;
