"use client"

import { CarItems } from "@/types/car.types"
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react"

type SubmitVehicle = Omit<CarItems, "carImages" | "id"> & {
	carImages: File[]
}

interface IVehicleContextType {
	addedCar: SubmitVehicle | undefined
	updateAddedCar: (data: Partial<SubmitVehicle>) => void
}

export const VehicleContext = createContext<IVehicleContextType | undefined>(
	undefined,
)

export default function VehicleContextProvider({
	children,
}: {
	children: ReactNode
}) {
	const [vehicleData, setVehicleData] = useState<SubmitVehicle>({
		title: "",
		description: "",
		model: "",
		make: "",
		year: 0,
		price: 0,
		color: "",
		mileage: 0,
		seatingCapacity: 0,
		engineCapacity: 0,
		carImages: [],
		fuelType: "Default",
		carCondition: "Default",
		transmissionType: "Default",
		carStatus: "",
		carValidationStatus: "",
		vin: "",
		licensePlate: "",
		name: undefined,
		dealerId: "", // Add a default value for dealerId
	})

	useEffect(() => {
		console.log("Car data in context:: ", vehicleData)
	}, [vehicleData])

	const updateAddedCar = useCallback((data: Partial<SubmitVehicle>) => {
		setVehicleData((prev) => ({ ...prev, ...data }))
	}, [])
	return (
		<VehicleContext.Provider value={{ addedCar: vehicleData, updateAddedCar }}>
			{children}
		</VehicleContext.Provider>
	)
}

export function useVehicleContext() {
	const context = useContext(VehicleContext)
	if (!context) {
		throw new Error("useVehicleContext must be used inside a Provider")
	}
	return context
}
