export interface PostRoot {
	isSuccess: boolean
	data: AllPostData
	successMessage: string
	errorMessage: string
	status: number
}

export interface AllPostData {
	totalCount: number
	pageSize: number
	currentPage: number
	totalPages: number
	items: PostItem[]
	hasNextPage: boolean
	hasPreviousPage: boolean
}

export interface PostItem {
	id: string
	caption: string
	content: string
	authorUsername: string
	authorAvatarUrl: string
	visibility: string
	carDto: CarDto
	createdAt: string
	updatedAt: string
	likeCount: number
	isLikedByCurrentUser: boolean
	commentCount: number
	viewCount: number
}

export interface CarDto {
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
	carImages: CarImage[]
	fuelType: string
	carCondition: string
	transmissionType: string
	carStatus: string
	carValidationStatus: string
	vin: string
	licensePlate: string
}

export interface CarImage {
	id: string
	carId: string
	url: string
}
