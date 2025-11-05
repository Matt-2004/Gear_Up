"use client";

import {
  IForgotPassword,
  ILoginFormData,
  INewPassword,
  IProfileFormData,
  IRegisterFormData,
} from "@/app/hooks/useFormData";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { getAccessToken } from "./getClientCookie";

interface IloginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
}

export interface UserProfileData {
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

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    // If the response is successful, just return it
    return response;
  },
  async (error) => {
    console.error("API Error Response:", error.response);
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        // Retrieve the stored refresh token.
        // Make a request to your auth server to refresh the token.
        const response = await axios.post(
          "http://localhost:5255/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        console.log("Refresh response:", response.data);

        // Update the authorization header with the new access token.
        return api(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export async function authRequest(
  url: string,
  formData: ILoginFormData | IRegisterFormData
): Promise<IloginResponse> {
  try {
    const res = await api.post(`${url}`, formData);

    return res.data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw error;
  }
}

export async function apiRequest(
  url: string,
  formData?: IForgotPassword | INewPassword | IProfileFormData,
  method: "POST" | "GET" | "PUT" = "POST"
) {
  try {
    const access_token = getAccessToken();
    console.log(access_token ? "Access Token still valid" : "Token Expired");
    console.log("Access Token:", access_token);

    const headers = { Authorization: `Bearer ${access_token}` };

    const fullUrl = `${API_URL}${url}`;

    if (method === "POST") {
      const res = await api.post(fullUrl, formData, {
        headers,
        withCredentials: true,
      });
      return res.data;
    }
    if (method === "PUT") {
      const res = await api.put(fullUrl, formData, {
        headers,
        withCredentials: true,
      });
      return res;
    }
    if (method === "GET") {
      const res = await api.get(fullUrl, {
        headers,
        withCredentials: true,
      });
      return res.data;
    }

    throw new Error(`Unsupported method: ${method}`);
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw error;
  }
}

export async function login(formData: ILoginFormData) {
  return authRequest("/api/v1/auth/login", formData);
}

export async function register(formData: IRegisterFormData) {
  return authRequest("/api/v1/auth/register", formData);
}

// Require access token in the header
export async function resentEmailForgetPassword(
  formData: IForgotPassword,
  email: string
) {
  return apiRequest(
    `/api/v1/auth/send-password-reset-token?email=${email}`,
    formData,
    "POST"
  );
}
export async function updateNewPassword(
  formData: INewPassword,
  reset_token: string
) {
  return apiRequest(
    `/api/v1/auth/reset-password?token=${reset_token}`,
    formData,
    "POST"
  );
}

export async function getUserProfile() {
  return apiRequest(
    "/api/v1/users/me",
    undefined,
    "GET"
  ) as Promise<UserProfileData>;
}

export async function updateUserProfile(formData: IProfileFormData) {
  return apiRequest("/api/v1/users/me", formData, "PUT");
}
