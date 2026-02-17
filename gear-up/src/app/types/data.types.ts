export interface authResponse {
	isSuccess: boolean
	message: string
	data: {
		accessToken: string
		refreshToken: string
		id?: string
		role?: string
		username?: string
		email?: string
		avatarUrl?: string
		[key: string]: any
	}
	status: number
}
