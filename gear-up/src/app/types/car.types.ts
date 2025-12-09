export interface Car {
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
	carImages: { id: string; url: string }[]
	fuelType: string
	carCondition: string
	transmissionType: string
	carStatus: string
	vin: string
	licensePlate: string
}
