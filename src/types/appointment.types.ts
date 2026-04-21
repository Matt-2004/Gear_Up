import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CursorBaseDTO } from "./post.types";

export interface createAppointmentDTO {
  agentId: string;
  carId: string;
  schedule: Date;
  location: string;
  notes?: string;
}

export type AppointmentStatus =
  | "All"
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Rejected"
  | "Scheduled"
  | "NoShow";

export interface AppointmentData {
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
  data: CursorResponse<AppointmentData[]>;
  status: number;
}
