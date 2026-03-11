import { apiFetch, apiPatch, apiPost } from "./AxiosClientBrowser";

export async function createAppointment(
  agentId: string,
  carId: string,
  schedule: Date,
  location: string,
  notes?: string,
) {
  return apiPost("/api/appointments", {
    agentId,
    carId,
    schedule,
    location,
    notes,
  });
}

export async function getAppointmentById(appointmentId: string) {
  return apiFetch(`/api/appointments/${appointmentId}`);
}

export async function dealerAppointments(cursor?: string) {
  const url = cursor
    ? `/api/appointments/dealer?cursor=${cursor}`
    : "/api/appointments/dealer";
  return apiFetch(url);
}

export async function myAppointments(cursor?: string) {
  const url = cursor
    ? `/api/appointments/my?cursor=${cursor}`
    : "/api/appointments/my";
  return apiFetch(url);
}

export async function cancelAppointmentById(appointmentId: string) {
  return apiPatch(`/api/appointments/${appointmentId}/cancel`);
}

export async function completeAppointmentById(appointmentId: string) {
  return apiPatch(`/api/appointments/${appointmentId}/complete`);
}

export async function acceptAppointmentById(appointmentId: string) {
  return apiPatch(`/api/appointments/${appointmentId}/accept`);
}

export async function rejectAppointmentById(
  appointmentId: string,
  data: { rejectionReason: string },
) {
  return apiPatch(`/api/appointments/${appointmentId}/reject`, data);
}
