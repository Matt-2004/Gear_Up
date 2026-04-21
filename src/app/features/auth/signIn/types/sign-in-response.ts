import { MainResponse } from "@/app/shared/types.ts/main-response";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDTO {
  usernameOrEmail: string;
  password: string;
}

export interface SignInResponse extends MainResponse<Tokens | null> {}
