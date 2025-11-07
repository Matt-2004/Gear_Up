export interface IloginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
}

export interface userProfileResponse {
  isSuccess: boolean;
  message: string;
  data: {
    id: string;
    provider: string | null;
    username: string;
    email: string;
    name: string;
    role: "Customer" | "Admin" | "Moderator";
    avatarUrl: string;
  };
  status: number;
}
