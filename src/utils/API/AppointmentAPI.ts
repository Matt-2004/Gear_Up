import { AppointmentResponse } from "@/types/appointment.types";
import { getFetch, patchFetch, postFetch } from "./AxiosClient";

export async function createAppointment(
  agentId: string,
  carId: string,
  schedule: Date,
  location: string,
  notes?: string,
) {
  return postFetch("/api/v1/appointments", {
    agentId,
    carId,
    schedule,
    location,
    notes,
  });
}

export async function getAppointmentById(appointmentId: string) {
  return getFetch(`/api/v1/appointments/${appointmentId}`);
}

export async function dealerAppointments(cursor?: string) {
  const url = cursor
    ? `/api/v1/appointments/dealer?cursor=${cursor}`
    : "/api/v1/appointments/dealer";
  return getFetch(url);
}

export async function myAppointments(cursor?: string) {
  const url = cursor
    ? `/api/v1/appointments/my?cursor=${cursor}`
    : "/api/v1/appointments/my";
  return getFetch(url);
}

export async function cancelAppointmentById(appointmentId: string) {
  return patchFetch(`/api/v1/appointments/${appointmentId}/cancel`);
}

export async function completeAppointmentById(appointmentId: string) {
  return patchFetch(`/api/v1/appointments/${appointmentId}/complete`);
}

export async function acceptAppointmentById(appointmentId: string) {
  return patchFetch(`/api/v1/appointments/${appointmentId}/accept`);
}

export async function rejectAppointmentById(
  appointmentId: string,
  data: { rejectionReason: string },
) {
  return patchFetch(`/api/v1/appointments/${appointmentId}/reject`, data);
}
