import { getCarById } from "@/app/shared/utils/API/CarAPI";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import AppointmentPage from "../../../features/car/ui/car-appointment/CarAppointment";
import { carDetailMapper } from "@/app/features/car/types/car.mapper";

async function getData(id: string) {
  try {
    const res = await getCarById(id);
    return res?.data ?? null;
  } catch (error) {
    console.error("Error fetching car data:", error);
    return null;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const carDetailData = await getData(id);

  if (!carDetailData) notFound();

  const car = carDetailMapper(carDetailData);

  return <AppointmentPage car={car} />;
};

export default Page;
