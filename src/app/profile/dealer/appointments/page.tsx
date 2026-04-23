import { AppointmentData } from "@/app/features/appointments/types/appointment.types";
import { CursorBaseDTO } from "@/app/features/post/types/post.types";

import Appointments from "../../../features/dashboards/dealer/ui/appointment/Appointments";
import { dealerAppointments } from "@/app/shared/utils/API/AppointmentAPI";

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
