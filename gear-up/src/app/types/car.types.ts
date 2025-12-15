export interface CarRoot {
	isSuccess: boolean
	message: string
	data: CarData
}

export interface CarData {
	totalCount: number
	pageSize: number
	currentPage: number
	totalPages: number
	items: CarItems[]
	hasNextPage: boolean
	hasPreviousPage: boolean
	status: number
}

export interface CarDetailData {
	isSuccess: boolean
	message: string
	data: CarItems
	status: number
}

export interface CarImages {
	id: string
	carId: string
	url: string
}

export interface CarItems {
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
	fuelType: string
	carCondition: string
	transmissionType: string
	carStatus: string
	carValidationStatus: string
	vin: string
	licensePlate: string
}
