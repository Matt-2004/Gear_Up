import Appointments from "../../../features/profiles/dealer/ui/appointment/Appointments";
import { dealerAppointments } from "@/app/shared/utils/API/AppointmentAPI";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { AppointmentModel } from "@/app/features/appointments/types/appointment.model";

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
  const appointments: CursorResponse<AppointmentModel[]> = {
    items: data?.items ?? [],
    nextCursor: data?.nextCursor ?? null,
    hasMore: data?.hasMore ?? false,
  };

  return <Appointments appointments={appointments} />;
};

export default Page;
