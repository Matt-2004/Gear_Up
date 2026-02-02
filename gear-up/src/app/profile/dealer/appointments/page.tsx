import { IAppointment } from "@/app/types/appointment.types";
import {
  dealerAppointments
} from "@/utils/API/AppointmentAPI";
import { getUserProfile } from "@/utils/API/UserAPI";
import Appointments from "./Appointments";

async function getData() {
  const user = await getUserProfile();

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
  let appointments: IAppointment[] = await getData();

  return <Appointments appointments={appointments} />;
};

export default Page;
