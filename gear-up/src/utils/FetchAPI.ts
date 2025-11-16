"use client";

import {
  IForgotPassword,
  ILoginFormData,
  INewPassword,
  IProfileFormData,
  IRegisterFormData,
} from "@/app/types/auth.types";
import { API_URL } from "@/lib/config";
import axios from "axios";
import {getAccessToken, getResetToken} from "./getClientCookie";
import {IAdminLogin} from "@/app/types/admin.types";
import useFormData from "@/app/hooks/useFormData";

export const refreshAccessToken = async () => {
  const refreshTokenPromise = await axios.post(
    `${API_URL}/api/v1/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return refreshTokenPromise;
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
      return res;
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
      return res;
    }

    throw new Error(`Unsupported method: ${method}`);
  } catch (error) {
    console.error("Fetch API Error:", error);
    throw error;
  }
}

export async function login(formData: ILoginFormData) {
  return await axios.post(`${API_URL}/api/v1/auth/login`, formData, {withCredentials: true});
}

export async function register(formData: IRegisterFormData) {
  return await axios.post(`${API_URL}/api/v1/auth/register`, formData, {
    withCredentials: true,
  });
}

// Require access token in the header
export async function verifyPassword(
  email: string
) {
  return apiRequest(
    `/api/v1/auth/send-password-reset-token?email=${email}`,
      undefined,
    "POST"
  );
}

export async function updateNewPassword(
  formData: INewPassword,
) {
    const reset_token = await getResetToken();
    console.log("Getting Reset token in API fetching:: ", reset_token);
  return  apiRequest(
    `/api/v1/auth/reset-password?token=${reset_token}`,
    formData,
    "POST"
  )
}

export async function getUserProfile() {
    const res = await apiRequest(
        "/api/v1/users/me",
        undefined,
        "GET"
    ) ;
    return res.data;
}

// export async function updateUserProfile(data) {
//
//   const formdata = useFormData("profile", data);
//   return apiRequest("/api/v1/users/me", formdata, "PUT");
// }

export async function kycRegister(data: FormData) {
  return apiRequest("/api/v1/users/kyc", data, "POST");
}

export async function adminLogin(data: IAdminLogin) {
    return await axios.post(`${API_URL}/api/v1/admin/login`, data, {withCredentials: true});
}

export async function getAllKyc() {
    return await apiRequest("/api/v1/admin/kyc", undefined, "GET");
}

export async function getKycById(id: string) {
    return await apiRequest(`/api/v1/admin/kyc/${id}`, undefined, "GET");
}
