import { ReactNode } from "react"
import { DefaultResponse } from "./Default_Response"

export interface ICar extends DefaultResponse<CarCursorDTO> {}

export interface CarCursorDTO {
	items: CarItems[]
	nextCursor: string | null
	hasMore: boolean
}

export interface CarImages {
	id: string
	carId: string
	url: string
}

export interface CarItems {
	name: ReactNode
	dealerId: string
	id: string
	title: string
	description: string
	model: string
	make: string
	year: number
	price: number
	color: string
	mileage: number
	seatingCapacity: number
	engineCapacity: number
	carImages: CarImages[]
	fuelType: IFuelType
	carCondition: ICarCondition
	transmissionType: ITransmissionType
	carStatus: string
	carValidationStatus: string
	vin: string
	licensePlate: string
}

export type ICarCondition = "Default" | "New" | "Used"

export type ITransmissionType =
	| "Default"
	| "Manual"
	| "Automatic"
	| "SemiAutomatic"

export type IFuelType = "Default" | "Petrol" | "Diesel" | "Electric" | "Hybrid"

export type CarStatus = "Pending" | "Approved" | "Rejected"
