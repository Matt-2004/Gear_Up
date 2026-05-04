import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";

export interface AppointmentDTO {
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
  status: AppointmentLifecycleStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface createAppointmentDTO {
  agentId: string;
  carId: string;
  schedule: Date;
  location: string;
  notes?: string;
}

export interface AppointmentResponse extends MainResponse<
  CursorResponse<AppointmentDTO[]>
> {}

export type AppointmentLifecycleStatus =
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Rejected"
  | "Scheduled"
  | "NoShow";

// Backward-compatible alias used across the codebase.
export type AppointmentStatus = AppointmentLifecycleStatus;

export type AppointmentFilterStatus = AppointmentLifecycleStatus | "All";
