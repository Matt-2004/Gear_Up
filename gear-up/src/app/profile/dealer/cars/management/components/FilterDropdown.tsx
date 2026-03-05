import { CarStatus } from "@/types/car.types"
import { Check, ChevronDown, Filter } from "lucide-react"

interface FilterDropdownProps {
	filter: CarStatus | "All"
	dropdownOpen: boolean
	carCounts: {
		total: number
		pending: number
		approved: number
		rejected: number
	}
	onToggleDropdown: () => void
	onFilterChange: (filter: CarStatus | "All") => void
}

const FilterDropdown = ({
	filter,
	dropdownOpen,
	carCounts,
	onToggleDropdown,
	onFilterChange,
}: FilterDropdownProps) => {
	const statusOptions: {
		label: string
		status: CarStatus | "All"
		count: number
	}[] = [
		{ label: "All", status: "All", count: carCounts.total },
		{ label: "Pending", status: "Pending", count: carCounts.pending },
		{ label: "Approved", status: "Approved", count: carCounts.approved },
		{ label: "Rejected", status: "Rejected", count: carCounts.rejected },
	]

	return (
		<div className="relative">
			<button
				onClick={onToggleDropdown}
				className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				<Filter className="h-4 w-4" />
				<span className="hidden sm:inline">
					{filter === "All" ? "All Status" : filter}
				</span>
				<ChevronDown
					className={`h-4 w-4 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{dropdownOpen && (
				<>
					<div className="fixed inset-0 z-20" onClick={onToggleDropdown} />
					<div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-30 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-sm duration-150">
						<div className="p-3">
							<p className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
								Filter by Status
							</p>
							<ul className="space-y-1">
								{statusOptions.map(({ label, status, count }) => (
									<li key={status}>
										<button
											onClick={() => {
												onFilterChange(status)
											}}
											className={`group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${
												filter === status
													? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-sm"
													: "text-gray-700 hover:bg-gray-100"
											}`}
										>
											<div className="flex items-center gap-2">
												{filter === status && <Check className="h-4 w-4" />}
												<span>{label}</span>
											</div>
											<span
												className={`rounded-full px-2.5 py-1 text-xs font-bold ${
													filter === status
														? "bg-white/20 text-white"
														: "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
												}`}
											>
												{count}
											</span>
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default FilterDropdown
