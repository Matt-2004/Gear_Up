export interface profileItem {
	accessToken: string
	refreshToken: string
	id?: string
	role?: string
	username?: string
	email?: string
	avatarUrl?: string
	[key: string]: any
}

export interface MainResponse<T> {
	isSuccess: boolean
	message: string
	data: T
	status: number
}
