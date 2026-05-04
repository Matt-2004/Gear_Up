import { IAdminUpdateStatus } from "@/app/features/profiles/dealer/types/kyc.types";
import { getFetch, putFetch } from "./AxiosClient";
import { MainResponse } from "../../types.ts/main-response";
import { AdminCarData } from "@/app/features/profiles/admin/types/admin-car-approval.types";
import { CursorResponse } from "../../types.ts/cursor-response";
import { CarDTO } from "@/app/features/car/types/car.dto";
import {
  KycDTO,
  KYCResponse,
} from "@/app/features/profiles/dealer/types/kyc.dto";

export async function getAllKyc(cursor?: string) {
  const url = cursor
    ? `/api/v1/admin/kyc?cursor=${cursor}`
    : "/api/v1/admin/kyc";
  return getFetch<KYCResponse>(url);
}

export async function getKycById(id: string) {
  return getFetch<MainResponse<KycDTO>>(`/api/v1/admin/kyc/${id}`);
}

export async function updateKycByAdmin(data: IAdminUpdateStatus, id: string) {
  return putFetch(`/api/v1/admin/kyc/${id}`, data);
}

export async function getKycWithStatus(status: string) {
  return getFetch(`/api/v1/admin/kyc/status/${status}`);
}

export async function getAllCars(pageNum: number, limit: number) {
  return getFetch<MainResponse<CursorResponse<CarDTO[]>>>(
    `/api/v1/admin/cars?pageNum=${pageNum}&limit=${limit}`,
  );
}

export async function getCarById(carId: string) {
  return getFetch<MainResponse<AdminCarData>>(`/api/v1/admin/cars/${carId}`);
}

export async function updateCarByAdmin(
  data: IAdminUpdateStatus,
  carId: string,
) {
  return putFetch(`/api/v1/admin/cars/${carId}`, data);
}

export async function getDealerCars(
  dealerId: string,
  pageNum: number,
  limit: number,
) {
  return getFetch(
    `/api/v1/admin/cars/dealer/${dealerId}?pageNum=${pageNum}&limit=${limit}`,
  );
}

export async function carStatusData(
  status: Omit<IAdminUpdateStatus, "rejectionReason">,
  pageNum: number,
  limit: number,
) {
  return getFetch(
    `/api/v1/admin/cars/status/${status}?pageNum=${pageNum}&limit=${limit}`,
  );
}
