import { AppointmentData } from "@/types/appointment.types";
import { CursorBaseDTO } from "@/types/post.types";
import { dealerAppointments } from "@/utils/API/AppointmentAPI";

import Appointments from "./Appointments";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const res = await dealerAppointments();
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return { items: [], nextCursor: null, hasMore: false };
  }
}

// Example mock data for development
const Page = async () => {
  const data = await getData();
  const appointments: Omit<CursorBaseDTO, "items"> & {
    items: AppointmentData[];
  } = {
    items: data?.items ?? [],
    nextCursor: data?.nextCursor ?? null,
    hasMore: data?.hasMore ?? false,
  };

  return <Appointments appointments={appointments} />;
};

export default Page;
