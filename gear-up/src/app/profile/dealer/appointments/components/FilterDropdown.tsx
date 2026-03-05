import { AppointmentStatus } from "@/types/appointment.types"
import { ChevronDown, Filter } from "lucide-react"

interface FilterDropdownProps {
	filter: AppointmentStatus | "All"
	dropdownOpen: boolean
	appointmentCounts: {
		total: number
		pending: number
		confirmed: number
		completed: number
		cancelled: number
		rejected: number
	}
	onToggleDropdown: () => void
	onFilterChange: (filter: AppointmentStatus | "All") => void
}

const FilterDropdown = ({
	filter,
	dropdownOpen,
	appointmentCounts,
	onToggleDropdown,
	onFilterChange,
}: FilterDropdownProps) => {
	const statusOptions: {
		label: string
		status: AppointmentStatus | "All"
		count: number
	}[] = [
		{ label: "All", status: "All", count: appointmentCounts.total },
		{ label: "Pending", status: "Pending", count: appointmentCounts.pending },
		{
			label: "Confirmed",
			status: "Confirmed",
			count: appointmentCounts.confirmed,
		},
		{
			label: "Completed",
			status: "Completed",
			count: appointmentCounts.completed,
		},
		{
			label: "Cancelled",
			status: "Cancelled",
			count: appointmentCounts.cancelled,
		},
		{
			label: "Rejected",
			status: "Rejected",
			count: appointmentCounts.rejected,
		},
	]

	return (
		<div className="relative">
			<button
				onClick={onToggleDropdown}
				className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<Filter className="h-4 w-4" />
				{filter === "All" ? "All Status" : filter}
				<ChevronDown
					className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{dropdownOpen && (
				<>
					<div className="fixed inset-0 z-20" onClick={onToggleDropdown} />
					<div className="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
						<ul className="p-1">
							{statusOptions.map(({ label, status, count }) => (
								<li key={status}>
									<button
										onClick={() => {
											onFilterChange(status)
										}}
										className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${
											filter === status
												? "bg-blue-50 text-blue-700"
												: "text-gray-700"
										}`}
									>
										<span>{label}</span>
										<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
											{count}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				</>
			)}
		</div>
	)
}

export default FilterDropdown
