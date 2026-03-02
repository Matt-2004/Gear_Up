import { MainResponse } from "./data.types"

export interface RegisterDTO {
	username: string
	firstName: string
	lastName: string
	email: string
	password: string
	confirmPassword: string
}

export interface LoginDTO {
	usernameOrEmail: string
	password: string
}

export interface ForgetPasswordDTO {
	email: string
}

export interface NewPasswordDTO {
	newPassword: string
	confirmedPassword: string
}

export interface ProfileDTO {
	NewEmail: string
	Name: string
	AvatarImage: string
	DateOfBirth: string
	PhoneNumber: string
	CurrentPassword: string
	NewPassword: string
	ConfirmedNewPassword: string
}

export interface AuthItem {
	accessToken: string
	refreshToken: string
}

export interface AuthResponse<T> extends MainResponse<T> {}
