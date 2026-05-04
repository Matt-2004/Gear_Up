import { AppointmentDTO } from "./appointment.dto";
import { AppointmentModel } from "./appointment.model";

export function AppointmentMapper(dto: AppointmentDTO): AppointmentModel {
  return {
    id: dto.id,
    agentId: dto.agentId,
    agentName: dto.agentName,
    requesterId: dto.requesterId,
    requesterName: dto.requesterName,
    carId: dto.carId,
    carTitle: dto.carTitle,
    schedule: dto.schedule,
    location: dto.location,
    notes: dto.notes,
    status: dto.status,
    rejectionReason: dto.rejectionReason,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
