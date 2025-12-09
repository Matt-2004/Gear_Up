export interface IRegisterFormData {
	username: string
	firstName: string
	lastName: string
	email: string
	password: string
	confirmPassword: string
}

export interface ILoginFormData {
	usernameOrEmail: string
	password: string
}

export interface IForgotPassword {
	email: string
}

export interface INewPassword {
	newPassword: string
	confirmedPassword: string
}

export interface IProfileFormData {
	NewEmail: string
	Name: string
	AvatarImage: string
	DateOfBirth: string
	PhoneNumber: string
	CurrentPassword: string
	NewPassword: string
	ConfirmedNewPassword: string
}
