export interface ResetPasswordRequest {
  newPassword: string;
  confirmePassword: string;
  token: string;
}
