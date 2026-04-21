import { SubmitVehicle } from "@/app/profile/dealer/cars/add/AddNewCarContext";
import { getFetch, postFetch, putFetch, deleteFetch } from "./AxiosClient";

export async function addCar(data: FormData) {
  return postFetch("/api/v1/cars", data);
}

export async function getAllCars(cursor: string | null) {
  return getFetch(`/api/v1/cars?cursor=${cursor ?? ""}`);
}

export async function updateCar(carId: string, data: FormData) {
  return putFetch(`/api/v1/cars/${carId}`, data);
}

export async function getCarById(carId: string) {
  return getFetch(`/api/v1/cars/${carId}`);
}

export async function deleteCarById(carId: string) {
  return deleteFetch(`/api/v1/cars/${carId}`);
}

export async function getMyCars(status: string, cursor: string | null) {
  const url = cursor
    ? `/api/v1/cars/my-car?status=${status}&cursor=${cursor}`
    : `/api/v1/cars/my-car?status=${status}`;
  const res = await getFetch(url);

  return res;
}

export async function searchCarWithQuery(query: string) {
  return getFetch(`/api/v1/cars/search?${query}`);
}
