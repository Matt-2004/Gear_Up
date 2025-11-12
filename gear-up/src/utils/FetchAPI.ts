"use client";

import {
  IForgotPassword,
  ILoginFormData,
  INewPassword,
  IProfileFormData,
  IRegisterFormData,
} from "@/app/hooks/useJSON";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { getAccessToken } from "./getClientCookie";
import { userProfileResponse } from "@/app/types/api.types";
import useFormData from "@/app/hooks/useFormData";

// Create an axios instance
// initiate data
const refreshAccessToken = async () => {
  const refreshTokenPromise = await axios.post(
    "http://localhost:5255/api/v1/auth/refresh",
    {},
    { withCredentials: true }
  );
  return refreshTokenPromise;
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Interceptors for api request
api.interceptors.request.use(
  async (request) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      // generate new refresh/access token
      await refreshAccessToken();
      const accessToken = getAccessToken();

      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
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
    | IProfileFormData
    | FormData
    | FormDataEntryValue,
  method: "POST" | "GET" | "PUT" = "POST"
) {
  try {
    const fullUrl = `${API_URL}${url}`;

    if (method === "POST") {
      const res = await api.post(fullUrl, formData);
      return res.data;
    }
    if (method === "PUT") {
      const res = await api.put(fullUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Axios often handles this automatically
        },
      });
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
  return axios.post(`${API_URL}/api/v1/auth/login`, formData, {
    withCredentials: true,
  });
}

export async function register(formData: IRegisterFormData) {
  return axios.post(`${API_URL}/api/v1/auth/register`, formData, {
    withCredentials: true,
  });
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
  ) as Promise<userProfileResponse>;
}

export async function updateUserProfile(data: Partial<IProfileFormData>) {
  // In here, I can convert Object data into FormData

  const formdata = useFormData("profile", data);
  return apiRequest("/api/v1/users/me", formdata, "PUT");
}

export async function kycRegister(data: FormData) {
  return apiRequest("/api/v1/users/kyc", data, "POST");
}
