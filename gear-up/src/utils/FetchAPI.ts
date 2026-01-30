"use server";

import { IAdminLogin } from "@/app/types/admin.types";
import { createAppointmentDTO } from "@/app/types/appointment.types";
import { INewPassword } from "@/app/types/auth.types";
import { AddComment } from "@/app/types/comment.types";
import { IKycUpdateByAdmin } from "@/app/types/kyc.types";
import { CreatePostData } from "@/app/types/post.types";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { cookies } from "next/headers";
import { getResetToken } from "./getClientCookie";

// Login & Registration -> Token integration
// The rest -> Token Check

export const api = axios.create({
  baseURL: API_URL,
});

export async function getFetch(url: string) {
  const access_token = (await cookies()).get("access_token")?.value;

  // url & options
  try {
    const response = await api.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log({
      status: error?.response?.status,
      data: error?.response?.data,
      headers: error?.response?.headers,
    });

    throw error;
  }
}

export async function postFetch(
  url: string,
  data:
    | INewPassword
    | IAdminLogin
    | FormData
    | null
    | AddComment
    | createAppointmentDTO
    | CreatePostData,
) {
  const access_token = (await cookies()).get("access_token")?.value;

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
  data: FormData | IKycUpdateByAdmin | string,
) {
  const access_token = (await cookies()).get("access_token")?.value;
  // url & options
  try {
    const response = await api.put(url, data, {
      headers: {
        "Content-Type": "application/json",
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
  const access_token = (await cookies()).get("access_token")?.value;
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

export async function patchFetch(url: string) {
  const access_token = (await cookies()).get("access_token")?.value;
  try {
    const respones = await api.patch(url, {
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

export async function resendVerificationEmail(email: string) {
  const res = await postFetch(
    `/api/v1/auth/resend-verification-email/email?=${email}`,
    null,
  );
  return res?.data;
}

export async function updateNewPassword(data: INewPassword) {
  const reset_token = await getResetToken();

  const res = await postFetch(
    `/api/v1/auth/reset-password?token=${reset_token}`,
    data,
  );
  return res?.data;
}

export async function getUserProfile() {
  const res = await getFetch("/api/v1/users/me");
  return res?.data;
}

export async function updateUserProfile(formdata: FormData) {
  const response = await putFetch("/api/v1/users/me", formdata);
  return response;
}

export async function kycRegister(data: FormData) {
  console.log("In KycRegsiter api function:: ", Object.fromEntries(data));
  const response = await postFetch("/api/v1/users/kyc", data);
  return response?.data;
}

export async function getAllKyc() {
  const res = await getFetch("/api/v1/admin/kyc");
  return res;
}

export async function getKycById(id: string) {
  const res = await getFetch(`/api/v1/admin/kyc/${id}`);
  return res?.data;
}

export async function updateKycByAdmin(data: IKycUpdateByAdmin, id: string) {
  const res = await putFetch(`/api/v1/admin/kyc/${id}`, data);
  return res?.data;
}

export async function getKycWithStatus(status: string) {
  const res = await getFetch(`/api/v1/kyc/status/${status}`);
  return res?.data;
}

export async function addCar(data: FormData) {
  const res = await postFetch(`/api/v1/cars`, data);
  return res;
}

export async function getAllCars(pageNumber: number) {
  const res = await getFetch(`/api/v1/cars?pageNum=${pageNumber}`);
  return res?.data;
}

export async function updateCar(carId: string, data: FormData) {
  const res = await putFetch(`/api/v1/cars/${carId}`, data);
  return res?.data;
}

export async function getCarById(carId: string) {
  const res = await getFetch(`/api/v1/cars/${carId}`);
  return res?.data;
}

export async function deleteCarById(carId: string) {
  const res = await deleteFetch(`/api/v1/cars/${carId}`);
  return res?.data;
}

export async function searchCarWithQuery(query: string) {
  const res = await getFetch(`/api/v1/cars/search?${query}`);
  return res?.data;
}

export async function getAllPosts(mode: string, pageNumber: number) {
  console.log("Number value:: ", pageNumber);
  const res = await getFetch(
    `/api/v1/posts?pageNumber=${pageNumber}&mode=${mode}`,
  );
  return res?.data;
}

export async function getPostById(postId: string) {
  const res = await getFetch(`/api/v1/posts/${postId}`);
  return res?.data;
}

export async function createPost(data: CreatePostData) {
  const res = await postFetch(`/api/v1/posts`, data);
  return res;
}

export async function giveLikeToPost(postId: string) {
  const res = await postFetch(`/api/v1/posts/${postId}/like`, null);
  return res?.data;
}

export async function getCommentsByPostId(postId: string) {
  const res = await getFetch(`/api/v1/comments/${postId}/top`);
  return res?.data;
}

export async function getNestedCommentsByCommentId(parentCommentId: string) {
  const res = await getFetch(`/api/v1/comments/${parentCommentId}/childrens`);
  return res?.data;
}

export async function addComment(data: AddComment) {
  const res = await postFetch(`/api/v1/comments`, data);
  return res?.data;
}

export async function addLikeToComment(commentId: string) {
  const res = await postFetch(`/api/v1/comments/${commentId}/like`, null);
  return res?.data;
}

export async function updateCommentById(commentId: string, content: string) {
  const res = await putFetch(`/api/v1/comments/${commentId}`, content);
  return res?.data;
}

export async function deleteCommentById(commentId: string) {
  const res = await deleteFetch(`/api/v1/comments/${commentId}`);
  return res?.data;
}

export async function createAppointment(
  agentId: string,
  carId: string,
  schedule: Date,
  location: string,
  notes?: string,
) {
  const res = await postFetch(`/api/v1/appointments`, {
    agentId,
    carId,
    schedule,
    location,
    notes,
  });
  return res?.data;
}

export async function getAppointmentById(appointmentId: string) {
  const res = await getFetch(`/api/v1/appointments/${appointmentId}`);
  return res?.data;
}

export async function dealerAppointments() {
  const res = await getFetch(`/api/v1/appointments/dealer`);
  return res?.data;
}

export async function myAppointments() {
  const res = await getFetch(`/api/v1/appointments/my`);
  return res?.data;
}

export async function cancelAppointmentById(appointmentId: string) {
  const res = await patchFetch(`/api/v1/appointments/${appointmentId}/cancel`);
  return res?.data;
}

export async function completeAppointmentById(appointmentId: string) {
  const res = await patchFetch(
    `/api/v1/appointments/${appointmentId}/complete`,
  );
  return res?.data;
}

export async function acceptAppointmentById(appointmentId: string) {
  const res = await patchFetch(`/api/v1/appointments/${appointmentId}/accept`);
  return res?.data;
}

export async function rejectAppointmentById(appointmentId: string) {
  const res = await patchFetch(`/api/v1/appointments/${appointmentId}/reject`);
  return res?.data;
}
