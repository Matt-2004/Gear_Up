export type EmailValidationVariant = "verification" | "reset-password";

export interface EmailValidationRequest {
  email: string;
}
