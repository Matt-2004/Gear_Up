import { getFetch, postFetch, putFetch, deleteFetch } from "./AxiosClient";
import { CarItems, CarsResponse } from "@/app/features/car/types/car.types";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { DashboardCarDTO } from "@/app/features/dashboards/dealer/types/dashboard-car/dashboard-car.dto";
import { AdminCarData } from "@/app/features/dashboards/admin/types/admin-car-approval.types";

export async function addCar(data: FormData) {
  return postFetch<null>("/api/v1/cars", data);
}

export async function getAllCars(cursor: string | null) {
  return getFetch<CursorResponse<CarItems[]>>(
    `/api/v1/cars?cursor=${cursor ?? ""}`,
  );
}

export async function updateCar(carId: string, data: FormData) {
  return putFetch(`/api/v1/cars/${carId}`, data);
}

export async function getCarById(carId: string) {
  return getFetch<MainResponse<AdminCarData>>(`/api/v1/cars/${carId}`);
}

export async function deleteCarById(carId: string) {
  return deleteFetch(`/api/v1/cars/${carId}`);
}

export async function getMyCars(status: string, cursor: string | null) {
  const url = cursor
    ? `/api/v1/cars/my-car?status=${status}&cursor=${cursor}`
    : `/api/v1/cars/my-car?status=${status}`;
  const res = await getFetch<MainResponse<CursorResponse<CarItems[]>>>(url);

  return res;
}

export async function searchCarWithQuery(query: string) {
  return getFetch<MainResponse<CursorResponse<CarItems[]>>>(
    `/api/v1/cars/search?${query}`,
  );
}
