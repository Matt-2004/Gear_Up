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
import { UserProfileData } from "@/app/types/api.types";

// Create an axios instance
// initiate data

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (request) => {
    const accessToken = getAccessToken();
    console.log(
      "Getting Access Token in interceptors request. Data:: ",
      accessToken
    );
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api interceptors that run before calling request
// Add a variable to track the refresh token promise
let refreshTokenPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already in progress, wait for it
      if (refreshTokenPromise) {
        try {
          await refreshTokenPromise;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start a new refresh
      refreshTokenPromise = axios.post(
        "http://localhost:5255/api/v1/auth/refresh",
        {},
        { withCredentials: true }
      );

      try {
        const response = await refreshTokenPromise;
        console.log("Refresh response:", response.data);

        // If your backend returns an access token, update the Authorization header
        if (response.data.accessToken) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
        }

        refreshTokenPromise = null;
        return api(originalRequest);
      } catch (refreshError) {
        refreshTokenPromise = null;
        console.error("Token refresh failed:", refreshError);

        // Clear auth state and redirect to login
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// main api calling function
export async function apiRequest(
  url: string,
  formData?:
    | ILoginFormData
    | IRegisterFormData
    | IForgotPassword
    | INewPassword
    | IProfileFormData,
  method: "POST" | "GET" | "PUT" = "POST"
) {
  try {
    const fullUrl = `${API_URL}${url}`;

    if (method === "POST") {
      const res = await api.post(fullUrl, formData);
      return res.data;
    }
    if (method === "PUT") {
      const res = await api.put(fullUrl, formData);
      return res;
    }
    if (method === "GET") {
      const res = await api.get(fullUrl);
      return res.data;
    }

    throw new Error(`Unsupported method: ${method}`);
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw error;
  }
}

export async function login(formData: ILoginFormData) {
  return apiRequest("/api/v1/auth/login", formData, "POST");
}

export async function register(formData: IRegisterFormData) {
  return apiRequest("/api/v1/auth/register", formData, "POST");
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
