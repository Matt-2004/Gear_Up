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
import axios, { AxiosError } from "axios";
import { SubmitVehicle } from "@/app/features/dashboards/dealer/context/AddNewCarContext";
import { EmailValidationRequest } from "@/app/features/auth/emailValidation/types/email-validation-request";
import { SignUpDTO } from "@/app/features/auth/signUp/types/sign-up-dto";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { ErrorResponse } from "../errors/errorResponse";
import { redirect } from "next/navigation";

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
    const err = error as AxiosError<any>;
    console.error("Error in getFetch:", err);
    return {
      isSuccess: false,
      data: null,
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      status: err.response?.status ?? 500,
    };
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

export async function postFetch<T>(
  url: string,
  data: PostFetchAvaliableType,
): Promise<MainResponse<T | null>> {
  const access_token = await getServerAccessToken();

  // url & options
  try {
    const response = await api.post(url, data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    return {
      isSuccess: false,
      data: null,
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      status: err.response?.status ?? 500,
    };
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
    const err = error as AxiosError<any>;
    return {
      isSuccess: false,
      data: null,
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      status: err.response?.status ?? 500,
    };
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
    const err = error as AxiosError<any>;
    return {
      isSuccess: false,
      data: null,
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      status: err.response?.status ?? 500,
    };
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
    const err = error as AxiosError<any>;
    return {
      isSuccess: false,
      data: null,
      message:
        err.response?.data?.message || err.message || "Something went wrong",
      status: err.response?.status ?? 500,
    };
  }
}
