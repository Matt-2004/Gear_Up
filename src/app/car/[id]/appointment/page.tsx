import { CarItems } from "@/types/car.types";
import { getCarById } from "@/utils/API/CarAPI";
import { notFound } from "next/navigation";
import AppointmentPage from "./AppointmentPage";

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
  const car = await getData(id);

  if (!car) notFound();

  return <AppointmentPage car={car as CarItems} />;
};

export default Page;
