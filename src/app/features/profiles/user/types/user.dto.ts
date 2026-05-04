import { MainResponse } from "@/app/shared/types.ts/main-response";

export type UserRole = "Customer" | "Admin" | "Dealer";

export interface UserDTO {
  id: string;
  provider: string | null;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  dateOfBirth: string;
  phoneNumber: number;
  avatarUrl: string;
}

export interface UserResponse extends MainResponse<UserDTO> {}
