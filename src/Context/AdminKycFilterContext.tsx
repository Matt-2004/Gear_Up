"use client"

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from "react"

export type KycDocumentType =
	| "Passport"
	| "NationalID"
	| "DriverLicense"
	| "UtilityBill"
	| "Other"
	| "All"

export type StatusType = "Pending" | "Approved" | "Rejected" | "All"

interface FilterState {
	searchData: string
	documentType: KycDocumentType
	statusType: StatusType
}

interface FilterContextType extends FilterState {
	setFilter: (filterState: Partial<FilterState>) => void
}

export const FilterContext = createContext<FilterContextType | undefined>(
	undefined,
)

export default function FilterProvider({ children }: { children: ReactNode }) {
	const defaultValue: FilterState = {
		searchData: "",
		documentType: "All",
		statusType: "All",
	}

	const [filterState, setFilterState] = useState<FilterState>(defaultValue)
	const setFilter = useCallback((name: Partial<FilterState>) => {
		setFilterState((prev) => ({ ...prev, ...name }))
	}, [])

	return (
		<FilterContext.Provider value={{ ...filterState, setFilter }}>
			{children}
		</FilterContext.Provider>
	)
}

export const useKycFilterContext = () => {
	const context = useContext(FilterContext)
	if (!context) {
		throw new Error("useKycFilterContext must be used inside a Provider")
	}
	return context
}
