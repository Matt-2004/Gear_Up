import { IAppointment } from "@/app/types/appointment.types";
import { CursorBaseDTO } from "@/app/types/post.types";
import { dealerAppointments } from "@/utils/API/AppointmentAPI";

import Appointments from "./Appointments";

async function getData() {

  try {
    const res = await dealerAppointments();
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}

// Example mock data for development
const Page = async () => {
  let appointments: Omit<CursorBaseDTO, "items"> & { items: IAppointment[] } =
    await getData();

  return <Appointments appointments={appointments} />;
};

export default Page;
