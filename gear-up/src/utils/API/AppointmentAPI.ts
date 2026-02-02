import { getFetch, patchFetch, postFetch } from "./AxiosClient"

export async function createAppointment(
	agentId: string,
	carId: string,
	schedule: Date,
	location: string,
	notes?: string,
) {
	const res = await postFetch(`/api/v1/appointments`, {
		agentId,
		carId,
		schedule,
		location,
		notes,
	})
	return res
}

export async function getAppointmentById(appointmentId: string) {
	const res = await getFetch(`/api/v1/appointments/${appointmentId}`)
	return res
}

export async function dealerAppointments(cursor?: string) {
	const url = cursor
		? `/api/v1/appointments/dealer?cursor=${cursor}`
		: `/api/v1/appointments/dealer`
	const res = await getFetch(url)
	return res
}

export async function myAppointments(cursor?: string) {
	const url = cursor
		? `/api/v1/appointments/my?cursor=${cursor}`
		: `/api/v1/appointments/my`
	const res = await getFetch(url)
	return res
}

export async function cancelAppointmentById(appointmentId: string) {
	const res = await patchFetch(`/api/v1/appointments/${appointmentId}/cancel`)
	return res
}

export async function completeAppointmentById(appointmentId: string) {
	const res = await patchFetch(`/api/v1/appointments/${appointmentId}/complete`)
	return res
}

export async function acceptAppointmentById(appointmentId: string) {
	const res = await patchFetch(`/api/v1/appointments/${appointmentId}/accept`)
	return res
}

export async function rejectAppointmentById(appointmentId: string) {
	const res = await patchFetch(`/api/v1/appointments/${appointmentId}/reject`)
	return res
}
