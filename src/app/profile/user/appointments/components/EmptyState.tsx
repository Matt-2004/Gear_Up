import { AppointmentStatus } from "@/types/appointment.types"
import { Calendar } from "lucide-react"

interface EmptyStateProps {
	filter: AppointmentStatus | "All"
}

const EmptyState = ({ filter }: EmptyStateProps) => {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
			<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
			<h3 className="mb-2 text-lg font-medium text-gray-900">
				No appointments found
			</h3>
			<p className="text-gray-600">
				{filter === "All"
					? "You haven't scheduled any appointments yet."
					: `No ${filter.toLowerCase()} appointments.`}
			</p>
		</div>
	)
}

export default EmptyState
