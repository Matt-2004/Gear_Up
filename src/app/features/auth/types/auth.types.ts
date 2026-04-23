export interface LoginDTO {
  usernameOrEmail: string;
  password: string;
}

export interface ForgetPasswordDTO {
  email: string;
}

export interface NewPasswordDTO {
  newPassword: string;
  confirmedPassword: string;
}

export interface ProfileDTO {
  NewEmail: string;
  Name: string;
  AvatarImage: string;
  DateOfBirth: string;
  PhoneNumber: string;
  CurrentPassword: string;
  NewPassword: string;
  ConfirmedNewPassword: string;
}
