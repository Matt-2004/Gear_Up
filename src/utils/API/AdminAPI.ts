import { IAdminUpdateStatus } from "@/types/kyc.types";
import { apiFetch, apiPut } from "./AxiosClientBrowser";

export async function getAllKyc(cursor?: string) {
  const url = cursor ? `/api/admin/kyc?cursor=${cursor}` : "/api/admin/kyc";
  return apiFetch(url);
}

export async function getKycById(id: string) {
  return apiFetch(`/api/admin/kyc/${id}`);
}

export async function updateKycByAdmin(data: IAdminUpdateStatus, id: string) {
  return apiPut(`/api/admin/kyc/${id}`, data);
}

export async function getKycWithStatus(status: string) {
  return apiFetch(`/api/admin/kyc/status/${status}`);
}

export async function getAllCars(pageNum: number, limit: number) {
  return apiFetch(`/api/admin/cars?pageNum=${pageNum}&limit=${limit}`);
}

export async function getCarById(carId: string) {
  return apiFetch(`/api/admin/cars/${carId}`);
}

export async function updateCarByAdmin(
  data: IAdminUpdateStatus,
  carId: string,
) {
  return apiPut(`/api/admin/cars/${carId}`, data);
}

export async function getDealerCars(
  dealerId: string,
  pageNum: number,
  limit: number,
) {
  return apiFetch(
    `/api/admin/cars/dealer/${dealerId}?pageNum=${pageNum}&limit=${limit}`,
  );
}

export async function carStatusData(
  status: Omit<IAdminUpdateStatus, "rejectionReason">,
  pageNum: number,
  limit: number,
) {
  return apiFetch(
    `/api/admin/cars/status/${status}?pageNum=${pageNum}&limit=${limit}`,
  );
}
