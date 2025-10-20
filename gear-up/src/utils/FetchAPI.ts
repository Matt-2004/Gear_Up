import {
  IForgotPassword,
  ILoginFormData,
  INewPassword,
  IRegisterFormData,
} from "@/app/hooks/useFormData";
import { API_URL } from "@/lib/config";
import axios from "axios";

export async function mainFetchAPI(
  url: string,
  formData?:
    | ILoginFormData
    | IRegisterFormData
    | IForgotPassword
    | INewPassword
    | null,
  access_token?: string
) {
  try {
    console.log("API_URL:", API_URL, "URL:", url);

    const { data } = await axios.post(`${API_URL}${url}`, formData, {
      headers: access_token ? { Authorization: `Bearer ${access_token}` } : {},
      withCredentials: true,
    });

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw error;
  }
}

export async function login(formData: ILoginFormData) {
  return mainFetchAPI("/api/v1/auth/login", formData);
}

export async function register(formData: IRegisterFormData) {
  return mainFetchAPI("/api/v1/auth/register", formData);
}

export async function resentEmailForgetPassword(
  formData: IForgotPassword,
  email: string,
  access_token?: string
) {
  return mainFetchAPI(
    `/api/v1/auth/send-password-reset-token?email=${email}`,
    formData,
    access_token
  );
}
export async function updateNewPassword(
  formData: INewPassword,
  access_token: string,
  reset_token: string
) {
  return mainFetchAPI(
    `/api/v1/auth/reset-password?token=${reset_token}`,
    formData,
    access_token
  );
}
