import { AppointmentResponse } from "@/app/features/appointments/types/appointment.dto";
import Appointments from "../../../features/appointments/ui/dashboard/Appointments";
import { getFetch } from "@/app/shared/utils/API/AxiosClient";

export const dynamic = "force-dynamic";

async function getData(cursor?: string) {
  const url = cursor
    ? `/api/v1/appointments/my?cursor=${encodeURIComponent(cursor)}`
    : "/api/v1/appointments/my";
  const res = await getFetch<AppointmentResponse>(url);
  return res;
}

const Page = async () => {
  const appointments = await getData();

  return <Appointments appointments={appointments} />;
};

export default Page;
