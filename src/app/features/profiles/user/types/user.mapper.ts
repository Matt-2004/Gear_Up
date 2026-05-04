import { UserDTO } from "./user.dto";
import { UserModel } from "./user.model";

export function UserMapper(dto: UserDTO): UserModel {
  return {
    id: dto.id,
    provider: dto.provider,
    displayName: dto.username,
    email: dto.email,
    realName: dto.name,
    role: dto.role,
    dateOfBirth: dto.dateOfBirth,
    phone: dto.phoneNumber,
    profileImage: dto.avatarUrl,
  };
}
