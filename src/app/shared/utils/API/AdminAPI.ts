import { IAdminUpdateStatus } from "@/app/features/dashboards/dealer/types/kyc.types";
import { getFetch, putFetch } from "./AxiosClient";

export async function getAllKyc(cursor?: string) {
  const url = cursor
    ? `/api/v1/admin/kyc?cursor=${cursor}`
    : "/api/v1/admin/kyc";
  return getFetch(url);
}

export async function getKycById(id: string) {
  return getFetch(`/api/v1/admin/kyc/${id}`);
}

export async function updateKycByAdmin(data: IAdminUpdateStatus, id: string) {
  return putFetch(`/api/v1/admin/kyc/${id}`, data);
}

export async function getKycWithStatus(status: string) {
  return getFetch(`/api/v1/admin/kyc/status/${status}`);
}

export async function getAllCars(pageNum: number, limit: number) {
  return getFetch(`/api/v1/admin/cars?pageNum=${pageNum}&limit=${limit}`);
}

export async function getCarById(carId: string) {
  return getFetch(`/api/v1/admin/cars/${carId}`);
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
