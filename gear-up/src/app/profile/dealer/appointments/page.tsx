import { IAppointment } from "@/app/types/appointment.types";
import Appointments from "./Appointments";

// Example mock data for development
const mockAppointments: IAppointment[] = [
  {
    id: "1",
    userId: "user-001",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    userPhone: "+66-81-234-5678",
    agentId: "dealer-001",
    agentName: "Premium Auto Dealer",
    carId: "car-001",
    carTitle: "2023 Toyota Camry - Excellent Condition",
    carMake: "Toyota",
    carModel: "Camry",
    carYear: 2023,
    schedule: "2026-02-15T10:00:00Z",
    location: "123 Sukhumvit Road, Bangkok, Thailand",
    notes: "Interested in test drive. Please prepare maintenance records.",
    status: "Pending",
    createdAt: "2026-01-28T14:30:00Z",
    updatedAt: "2026-01-28T14:30:00Z",
  },
  {
    id: "2",
    userId: "user-002",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    userPhone: "+66-82-345-6789",
    agentId: "dealer-001",
    agentName: "Premium Auto Dealer",
    carId: "car-002",
    carTitle: "2024 Honda Civic - Like New",
    carMake: "Honda",
    carModel: "Civic",
    carYear: 2024,
    schedule: "2026-02-16T14:30:00Z",
    location: "456 Rama IV Road, Bangkok, Thailand",
    notes: "Looking for financing options as well.",
    status: "Confirmed",
    createdAt: "2026-01-27T09:15:00Z",
    updatedAt: "2026-01-29T11:20:00Z",
  },
  {
    id: "3",
    userId: "user-003",
    userName: "Michael Chen",
    userEmail: "m.chen@example.com",
    userPhone: "+66-83-456-7890",
    agentId: "dealer-001",
    agentName: "Premium Auto Dealer",
    carId: "car-003",
    carTitle: "2022 Tesla Model 3 - Low Mileage",
    carMake: "Tesla",
    carModel: "Model 3",
    carYear: 2022,
    schedule: "2026-02-10T09:00:00Z",
    location: "789 Wireless Road, Bangkok, Thailand",
    status: "Completed",
    createdAt: "2026-01-20T16:45:00Z",
    updatedAt: "2026-02-10T10:30:00Z",
  },
  {
    id: "4",
    userId: "user-004",
    userName: "Emily Wong",
    userEmail: "emily.wong@example.com",
    userPhone: "+66-84-567-8901",
    agentId: "dealer-001",
    agentName: "Premium Auto Dealer",
    carId: "car-004",
    carTitle: "2023 BMW 3 Series - Premium Package",
    carMake: "BMW",
    carModel: "3 Series",
    carYear: 2023,
    schedule: "2026-02-20T11:00:00Z",
    location: "321 Sathorn Road, Bangkok, Thailand",
    notes: "Would like to see all available colors",
    status: "Pending",
    createdAt: "2026-01-29T13:00:00Z",
    updatedAt: "2026-01-29T13:00:00Z",
  },
  {
    id: "5",
    userId: "user-005",
    userName: "David Lee",
    userEmail: "david.lee@example.com",
    userPhone: "+66-85-678-9012",
    agentId: "dealer-001",
    agentName: "Premium Auto Dealer",
    carId: "car-005",
    carTitle: "2021 Mercedes-Benz C-Class",
    carMake: "Mercedes-Benz",
    carModel: "C-Class",
    carYear: 2021,
    schedule: "2026-02-05T08:30:00Z",
    location: "555 Phahonyothin Road, Bangkok, Thailand",
    status: "Cancelled",
    createdAt: "2026-01-25T10:20:00Z",
    updatedAt: "2026-01-30T09:15:00Z",
  },
];

const Page = async () => {
  let appointments: IAppointment[] = mockAppointments;

  // Uncomment this when API is ready
  // try {
  //   const response = await dealerAppointments();
  //   if (response?.isSuccess) {
  //     appointments = response.data;
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch appointments:", error);
  // }

  return <Appointments appointments={appointments} />;
};

export default Page;
