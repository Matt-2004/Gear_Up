"use server";

import {
  IForgotPassword,
  ILoginFormData,
  INewPassword,
  IProfileFormData,
  IRegisterFormData,
} from "@/app/hooks/useFormData";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { cookies } from "next/headers";

const getAccessToken = async () => {
  const cookieStore = await cookies();
  console.log("access_token:", cookieStore.get("access_token")?.value);
  return cookieStore.get("access_token")?.value;
};

interface IloginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
}

export async function authRequest(
  url: string,
  formData: ILoginFormData | IRegisterFormData
): Promise<IloginResponse> {
  console.log("URL:: ", `${API_URL}${url}`);
  try {
    const res = await axios.post<IloginResponse>(`${API_URL}${url}`, formData, {
      withCredentials: true,
    });
    const { data, status } = res.data;

    // setCookie
    const cookieStore = await cookies();
    console.log("CookieStore", cookieStore);

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
    const headers = { Authorization: `Bearer ${access_token}` };

    const fullUrl = `${API_URL}${url}`;

    let response;

    if (method === "POST") {
      response = await axios.post(fullUrl, formData, {
        headers,
        withCredentials: true,
      });
    } else if (method === "PUT") {
      response = await axios.put(fullUrl, formData, {
        headers,
        withCredentials: true,
      });
    } else if (method === "GET") {
      response = await axios.get(fullUrl, { headers, withCredentials: true });
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
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
  return apiRequest("/api/v1/users/me", undefined, "GET");
}

export async function updateUserProfile(formData: IProfileFormData) {
  return apiRequest("/api/v1/users", formData, "PUT");
}
