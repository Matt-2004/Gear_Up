import { AppointmentStatus } from "@/types/appointment.types"

export const getStatusColor = (status: AppointmentStatus) => {
	switch (status) {
		case "Pending":
			return "bg-yellow-100 text-yellow-800 border-yellow-300"
		case "Confirmed":
			return "bg-blue-100 text-blue-800 border-blue-300"
		case "Completed":
			return "bg-green-100 text-green-800 border-green-300"
		case "Cancelled":
			return "bg-gray-100 text-gray-800 border-gray-300"
		case "Rejected":
			return "bg-red-100 text-red-800 border-red-300"
		default:
			return "bg-gray-100 text-gray-800 border-gray-300"
	}
}

export const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date)
}
