import { MainResponse } from "@/app/shared/types.ts/main-response";

type UserRole = "Customer" | "Admin" | "Dealer";

export interface UserResponse<T> extends MainResponse<T> {}

export interface UserItem {
  id: string;
  provider: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  dateOfBirth: string;
  phoneNumber: number;
  avatarUrl: string;
}
