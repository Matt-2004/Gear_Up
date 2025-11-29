"use client";

import {
  ILoginFormData,
  INewPassword,
  IRegisterFormData,
} from "@/app/types/auth.types";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { getAccessToken, getResetToken } from "./getClientCookie";
import { IAdminLogin } from "@/app/types/admin.types";
import { IKycUpdateByAdmin } from "@/app/types/kyc.types";

export const refreshAccessToken = async () => {
  return await axios.post(
    `${API_URL}/api/v1/auth/refresh`,
    {},
    { withCredentials: true },
  );
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
  },
);

export async function login(formData: ILoginFormData) {
  const res = await axios.post(`${API_URL}/api/v1/auth/login`, formData, {
    withCredentials: true,
  });
  return res.data;
}

export async function register(formData: IRegisterFormData) {
  const res = await axios.post(`${API_URL}/api/v1/auth/register`, formData, {
    withCredentials: true,
  });
  return res.data;
}

// Require access token in the header
export async function resendVerificationEmail(email: string) {
  const res = await api.post(
    `/api/v1/auth/resend-verification-email/email?=${email}`,
  );
  return res?.data;
}

export async function updateNewPassword(formData: INewPassword) {
  const reset_token = await getResetToken();

  const res = await api.post(
    `/api/v1/auth/reset-password?token=${reset_token}`,
    formData,
  );
  return res?.data;
}

export async function getUserProfile() {
  const res = await api.get("/api/v1/users/me");
  console.log("This is running on backend:: ", res?.data.data);
  return res?.data;
}

// export async function updateUserProfile(data) {
//
//   const formdata = useFormData("profile", data);
//   return apiRequest("/api/v1/users/me", formdata, "PUT");
// }

export async function kycRegister(data: FormData) {
  const response = await api.post("/api/v1/users/kyc", data);
  return response?.data;
}

export async function adminLogin(data: IAdminLogin) {
  const response = await axios.post(`${API_URL}/api/v1/admin/login`, data, {
    withCredentials: true,
  });
  return response.data;
}

export async function getAllKyc() {
  return await api.get("/api/v1/admin/kyc");
}

export async function getKycById(id: string) {
  const res = await api.get(`/api/v1/admin/kyc/${id}`);
  return res?.data;
}

export async function updateKycByAdmin(data: IKycUpdateByAdmin, id: string) {
  const res = await api.put(`/api/v1/admin/kyc/${id}`, data);
  return res?.data;
}

export async function getKycWithStatus(status: string) {
  const res = await api.get(`/api/v1/kyc/status/${status}`);
  return res?.data;
}

export async function addCar(data: FormData) {
  const res = await api.post(`/api/v1/cars`, data);
  return res?.data;
}

export async function getAllCars() {
  const res = await api.get("/api/v1/cars");
  return res?.data;
}

export async function getFakeCars() {
  const res = await axios.get("/fakeData.json");
  return res?.data;
}

export async function updateCar(carId: string, data: FormData) {
  const res = await api.post(`/api/v1/cars/${carId}`, data);
  return res?.data;
}

export async function getCarById(carId: string) {
  const res = await api.get(`/api/v1/cars/${carId}`);
  return res?.data;
}
