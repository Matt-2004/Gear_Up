import { UserRole } from "./user.dto";

export interface UserModel {
  id: string;
  provider: string | null;
  displayName: string;
  email: string;
  realName: string;
  role: UserRole;
  dateOfBirth: string;
  phone: number;
  profileImage: string;
}
