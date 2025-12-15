export interface PostData {
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
	visibility: string
	carDto: CarDto
	createdAt: string
	updatedAt: string
	likeCount: number
	isLikedByCurrentUser: boolean
	commentCount: number
	viewCount: number
	latestComments: LatestComment[]
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

export interface LatestComment {
	id: string
	postId: string
	commentedUserId: string
	commentedUserName: string
	likeCount: number
	isLikedByCurrentUser: boolean
	isEdited: boolean
	commentedUserProfilePictureUrl: string
	content: string
	parentCommentId: any
	replies: any[]
	createdAt: string
	updatedAt: string
}
