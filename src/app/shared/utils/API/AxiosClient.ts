"use server";

import { AdminLoginDTO } from "@/app/features/dashboards/admin/types/admin.types";
import { createAppointmentDTO } from "@/app/features/appointments/types/appointment.types";
import { LoginDTO, NewPasswordDTO } from "@/app/features/auth/types/auth.types";
import { AddComment } from "@/app/features/comment/types/comment.types";
import { IAdminUpdateStatus } from "@/app/features/dashboards/dealer/types/kyc.types";
import { CreateMessageDTO } from "@/app/features/messaging/types/message.types";
import { CreatePostData } from "@/app/features/post/types/post.types";
import { IReviewSubmissionDTO } from "@/app/features/review/types/review.types";
import { BACKEND_API_URL } from "@/app/shared/utils/config";
import { getServerAccessToken } from "@/app/shared/utils/AuthUtils/tokenUtils";
import axios from "axios";
import { SubmitVehicle } from "@/app/features/dashboards/dealer/context/AddNewCarContext";
import { EmailValidationRequest } from "@/app/features/auth/emailValidation/types/email-validation-request";
import { SignUpDTO } from "@/app/features/auth/signUp/types/sign-up-dto";

export const api = axios.create({
  baseURL: BACKEND_API_URL,
});

export async function getFetch(url: string) {
  const access_token = await getServerAccessToken();
  // url & options
  try {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getFetch:", error?.response);

    throw error;
  }
}

type PostFetchAvaliableType =
  | SignUpDTO
  | EmailValidationRequest
  | LoginDTO
  | NewPasswordDTO
  | AdminLoginDTO
  | FormData
  | null
  | AddComment
  | createAppointmentDTO
  | CreatePostData
  | Omit<CreatePostData, "carId">
  | CreateMessageDTO
  | IReviewSubmissionDTO
  | Omit<IReviewSubmissionDTO, "dealerId">
  | SubmitVehicle;

export async function postFetch(url: string, data: PostFetchAvaliableType) {
  const access_token = await getServerAccessToken();

  // url & options
  try {
    const response = await api.post(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error in postFetch:", error?.response?.data);
    throw error;
  }
}

export async function putFetch(
  url: string,
  data:
    | FormData
    | IAdminUpdateStatus
    | string
    | Omit<IReviewSubmissionDTO, "dealerId">
    | Omit<CreatePostData, "carId">,
) {
  const access_token = await getServerAccessToken();
  // url & options
  console.log("Data:: ", data);
  try {
    const response = await api.put(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error in putFetch:", error?.response?.data);
    throw error;
  }
}

export async function deleteFetch(url: string) {
  const access_token = await getServerAccessToken();
  // url & options
  try {
    const response = await api.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error in deleteFetch:", error?.response?.data);
    throw error;
  }
}

export async function patchFetch(
  url: string,
  data?: { rejectionReason: string },
) {
  const access_token = await getServerAccessToken();

  try {
    const respones = await api.patch(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return respones.data;
  } catch (error: any) {
    console.log("Error in patchFetch:", error?.response?.data);
    throw error;
  }
}
