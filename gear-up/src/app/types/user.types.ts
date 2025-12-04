export interface loginRes {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
}

export interface getUserProfileRes {
  isSuccess: boolean;
  message: string;
  data: UserData;
  status: number;
}

export interface UserData {
  id: string;
  provider: string | null;
  username: string;
  email: string;
  name: string;
  role: "Customer" | "Admin" | "Dealer";
  avatarUrl: string;
}
