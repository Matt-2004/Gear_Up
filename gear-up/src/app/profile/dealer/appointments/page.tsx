import { IAppointment } from "@/app/types/appointment.types";
import {
  dealerAppointments,
  getUserProfile,
  myAppointments,
} from "@/utils/FetchAPI";
import Appointments from "./Appointments";

async function getData() {
  const user = await getUserProfile();

  try {
    if (user?.role == "Dealer") {
      const res = await dealerAppointments();
      return res;
    } else if (user?.role == "Customer") {
      const res = await myAppointments();
      return res;
    }
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}

// Example mock data for development
const Page = async () => {
  let appointments: IAppointment[] = await getData();

  // Uncomment this when API is ready
  // try {
  //   const response = await dealerAppointments();
  //   if (response?.isSuccess)
  //     appointments = response.data;
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch appointments:", error);
  // }

  return <Appointments appointments={appointments} />;
};

export default Page;
