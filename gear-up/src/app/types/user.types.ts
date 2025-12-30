export interface loginRes {
	isSuccess: boolean
	message: string
	data: {
		accessToken: string
		refreshToken: string
	}
	status: number
}

export interface getUserProfileRes {
	isSuccess: boolean
	message: string
	data: IUser
	status: number
}

type UserRole = "Customer" | "Admin" | "Dealer"

export interface IUser {
	id: number
	provider: string
	username: string
	email: string
	name: string
	role: UserRole
	dateOfBirth: string
	phoneNumber: number
	avatarUrl: string
}
