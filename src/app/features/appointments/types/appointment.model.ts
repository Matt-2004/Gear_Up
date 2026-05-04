import { AppointmentLifecycleStatus } from "./appointment.dto";

export interface AppointmentModel {
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
