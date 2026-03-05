import { CarStatus } from "@/types/car.types"
import { useState } from "react"

export function useCarFilters() {
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [statusFilter, setStatusFilter] = useState<CarStatus | "All">("All")
	const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

	const toggleFilters = () => setIsFilterOpen((prev) => !prev)
	const toggleStatusDropdown = () => setStatusDropdownOpen((prev) => !prev)
	const setStatusWithClose = (status: CarStatus | "All") => {
		setStatusFilter(status)
		setStatusDropdownOpen(false)
	}

	return {
		isFilterOpen,
		statusFilter,
		statusDropdownOpen,
		toggleFilters,
		toggleStatusDropdown,
		setStatusFilter: setStatusWithClose,
	}
}
