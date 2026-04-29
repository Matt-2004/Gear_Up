import {
  IAdminUpdateStatus,
  IKycSubmissions,
} from "@/app/features/dashboards/dealer/types/kyc.types";
import { getFetch, putFetch } from "./AxiosClient";
import { MainResponse } from "../../types.ts/main-response";
import { AdminCarData } from "@/app/features/dashboards/admin/types/admin-car-approval.types";
import { CursorResponse } from "../../types.ts/cursor-response";
import { CarItems } from "@/app/features/car/types/car.types";
import { DashboardCarDTO } from "@/app/features/dashboards/dealer/types/dashboard-car/dashboard-car.dto";

export async function getAllKyc(cursor?: string) {
  const url = cursor
    ? `/api/v1/admin/kyc?cursor=${cursor}`
    : "/api/v1/admin/kyc";
  return getFetch<MainResponse<CursorResponse<IKycSubmissions[]>>>(url);
}

export async function getKycById(id: string) {
  return getFetch<MainResponse<IKycSubmissions>>(`/api/v1/admin/kyc/${id}`);
}

export async function updateKycByAdmin(data: IAdminUpdateStatus, id: string) {
  return putFetch(`/api/v1/admin/kyc/${id}`, data);
}

export async function getKycWithStatus(status: string) {
  return getFetch(`/api/v1/admin/kyc/status/${status}`);
}

export async function getAllCars(pageNum: number, limit: number) {
  return getFetch<MainResponse<CursorResponse<DashboardCarDTO[]>>>(
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
