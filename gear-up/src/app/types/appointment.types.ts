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
  | "Rejected"
  | "Scheduled";

export interface IAppointment {
  id: string;
  agentId: string;
  agentName: string;
  requesterId: string;
  requesterName: string;
  carId: string;
  carTitle: string;
  schedule: string;
  location: string;
  notes?: string;
  status: AppointmentStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentResponse {
  isSuccess: boolean;
  message: string;
  data: IAppointment[];
  status: number;
}
