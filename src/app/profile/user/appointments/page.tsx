import { AppointmentResponse } from "@/app/features/appointments/types/appointment.types";
import Appointments from "../../../features/appointments/ui/dashboard/Appointments";
import { getFetch } from "@/app/shared/utils/API/AxiosClient";

async function getData(cursor?: string) {
  const url = cursor
    ? `/api/v1/appointments/my?cursor=${encodeURIComponent(cursor)}`
    : "/api/v1/appointments/my";
  const res = await getFetch(url);

  return res as AppointmentResponse;
}

const Page = async () => {
  const appointments = await getData();

  return <Appointments appointments={appointments} />;
};

export default Page;
