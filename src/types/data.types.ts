export interface profileItem {
  accessToken: string;
  refreshToken: string;
  id?: string;
  role?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  [key: string]: any;
}
