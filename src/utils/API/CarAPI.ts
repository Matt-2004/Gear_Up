import { apiFetch, apiPost, apiPut, apiDelete } from "./AxiosClientBrowser";

export async function addCar(data: FormData) {
  return apiPost("/api/cars", data);
}

export async function getAllCars(cursor: string | null) {
  return apiFetch(`/api/cars?cursor=${cursor ?? ""}`);
}

export async function updateCar(carId: string, data: FormData) {
  return apiPut(`/api/cars/${carId}`, data);
}

export async function getCarById(carId: string) {
  return apiFetch(`/api/cars/${carId}`);
}

export async function deleteCarById(carId: string) {
  return apiDelete(`/api/cars/${carId}`);
}

export async function getMyCars(status: string, cursor: string | null) {
  if (!status) throw new Error("Status parameter is required");
  return apiFetch(`/api/cars/my-car?status=${status}&cursor=${cursor ?? ""}`);
}

export async function searchCarWithQuery(query: string) {
  return apiFetch(`/api/cars/search?${query}`);
}
