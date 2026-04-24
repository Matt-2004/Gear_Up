import { AppointmentData } from "@/app/features/appointments/types/appointment.types";

import Appointments from "../../../features/dashboards/dealer/ui/appointment/Appointments";
import { dealerAppointments } from "@/app/shared/utils/API/AppointmentAPI";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

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
  const appointments: CursorResponse<AppointmentData[]> = {
    items: data?.items ?? [],
    nextCursor: data?.nextCursor ?? null,
    hasMore: data?.hasMore ?? false,
  };

  return <Appointments appointments={appointments} />;
};

export default Page;
