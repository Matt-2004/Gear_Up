import { Metadata } from "next";
import { getCarById } from "@/app/shared/utils/API/CarAPI";
import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";
import SectionErrorBoundary from "@/app/shared/ui/SectionErrorBoundary";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import AppointmentPage from "../../../features/car/ui/car-appointment/CarAppointment";
import { carDetailMapper } from "@/app/features/car/types/car.mapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getCarById(id);
    const car = carDetailMapper(res?.data);
    return {
      title: `Schedule Appointment — ${car.make} ${car.model}`,
      description: `Book an appointment to view the ${car.year} ${car.make} ${car.model}. ${car.title}`,
    };
  } catch {
    return {
      title: "Schedule Appointment — Gear Up",
      description: "Book an appointment to view this vehicle.",
    };
  }
}

async function getData(id: string) {
  try {
    const res = await getCarById(id);
    return res?.data ?? null;
  } catch (error) {
    console.error("Error fetching car data:", error);
    if (error instanceof ErrorResponse && error.status === 404) {
      return null;
    }
    throw error;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const carDetailData = await getData(id);

  if (!carDetailData) notFound();

  const car = carDetailMapper(carDetailData);

  return (
    <SectionErrorBoundary>
      <AppointmentPage car={car} />
    </SectionErrorBoundary>
  );
};

export default Page;
