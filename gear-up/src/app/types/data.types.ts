export interface authResponse {
	isSuccess: boolean
	message: string
	data: {
		accessToken: string
		refreshToken: string
	}
	status: number
}
