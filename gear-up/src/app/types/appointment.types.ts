export interface createAppointmentDTO {
  agentId: string;
  carId: string;
  schedule: Date;
  location: string;
  notes?: string;
}

export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export interface IAppointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  agentId: string;
  agentName: string;
  carId: string;
  carTitle: string;
  carMake: string;
  carModel: string;
  carYear: number;
  schedule: string;
  location: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentResponse {
  isSuccess: boolean;
  message: string;
  data: IAppointment[];
  status: number;
}
