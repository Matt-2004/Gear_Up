export interface LoginInputDTO {
  usernameOrEmail: string;
  password: string;
}

export interface ForgetPasswordInputDTO {
  email: string;
}

export interface ResetPasswordInputDTO {
  newPassword: string;
  confirmedPassword: string;
}

export interface ProfileInputDTO {
  NewEmail: string;
  Name: string;
  AvatarImage: string;
  DateOfBirth: string;
  PhoneNumber: string;
  CurrentPassword: string;
  NewPassword: string;
  ConfirmedNewPassword: string;
}
