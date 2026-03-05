"use client"

import { CarStatus } from "@/types/car.types"
import { createContext, useContext, useState } from "react"

export type CarStatusType = CarStatus | "All"
export type CarConditionType = "All" | "New" | "Used"
export type FuelTypeFilter = "All" | "Petrol" | "Diesel" | "Electric" | "Hybrid"

interface FilterConfig {
	searchData: string
	statusType: CarStatusType
	conditionType: CarConditionType
	fuelType: FuelTypeFilter
}

interface FilterContextType {
	filter: FilterConfig
	setFilter: (newFilter: Partial<FilterConfig>) => void
	clearFilters: () => void
}

const initialFilter: FilterConfig = {
	searchData: "",
	statusType: "All",
	conditionType: "All",
	fuelType: "All",
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const useCarFilterContext = () => {
	const context = useContext(FilterContext)
	if (!context) {
		throw new Error("useCarFilterContext must be used within FilterProvider")
	}
	return context
}

const FilterProvider = ({ children }: { children: React.ReactNode }) => {
	const [filter, setFilterState] = useState<FilterConfig>(initialFilter)

	const setFilter = (newFilter: Partial<FilterConfig>) => {
		setFilterState((prev) => ({ ...prev, ...newFilter }))
	}

	const clearFilters = () => {
		setFilterState(initialFilter)
	}

	return (
		<FilterContext.Provider value={{ filter, setFilter, clearFilters }}>
			{children}
		</FilterContext.Provider>
	)
}

export default FilterProvider
