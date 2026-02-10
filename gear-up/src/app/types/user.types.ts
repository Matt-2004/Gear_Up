export interface loginRes {
	isSuccess: boolean
	message: string
	data: {
		accessToken: string
		refreshToken: string
	}
	status: number
}

export interface IUser {
	isSuccess: boolean
	message: string
	data: IUserData
	status: number
}

type UserRole = "Customer" | "Admin" | "Dealer"

export interface IUserData {
	id: string
	provider: string
	username: string
	email: string
	name: string
	role: UserRole
	dateOfBirth: string
	phoneNumber: number
	avatarUrl: string
}
