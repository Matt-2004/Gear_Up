import { deleteFetch, getFetch, postFetch, putFetch } from "./AxiosClient"

export async function addCar(data: FormData) {
	const res = await postFetch(`/api/v1/cars`, data)
	return res
}

export async function getAllCars(pageNumber: number) {
	const res = await getFetch(`/api/v1/cars?pageNum=${pageNumber}`)
	return res
}

export async function updateCar(carId: string, data: FormData) {
	const res = await putFetch(`/api/v1/cars/${carId}`, data)
	return res
}

export async function getCarById(carId: string) {
	const res = await getFetch(`/api/v1/cars/${carId}`)
	return res
}

export async function deleteCarById(carId: string) {
	const res = await deleteFetch(`/api/v1/cars/${carId}`)
	return res
}

export async function getMyCars() {
	const res = await getFetch(`/api/v1/cars/my-car`)
	return res
}

export async function searchCarWithQuery(query: string) {
	const res = await getFetch(`/api/v1/cars/search?${query}`)
	return res
}
