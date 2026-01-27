export interface createAppointmentDTO {
  agentId: string;
  carId: string;
  schedule: Date;
  location: string;
  notes?: string;
}
