import { IAdminUpdateStatus } from "@/app/types/kyc.types"
import { getFetch, putFetch } from "./AxiosClient"

export async function getAllKyc(cursor?: string) {
	const url = cursor
		? `/api/v1/admin/kyc?cursor=${cursor}`
		: `/api/v1/admin/kyc`
	const res = await getFetch(url)
	return res
}

export async function getKycById(id: string) {
	const res = await getFetch(`/api/v1/admin/kyc/${id}`)
	return res
}

export async function updateKycByAdmin(data: IAdminUpdateStatus, id: string) {
	const res = await putFetch(`/api/v1/admin/kyc/${id}`, data)
	return res
}

export async function getKycWithStatus(status: string) {
	const res = await getFetch(`/api/v1/admin/kyc/status/${status}`)
	return res
}

export async function getAllCars(pageNum: number, limit: number) {
	const res = await getFetch(
		"/api/v1/admin/cars?pageNum=" + pageNum + "&limit=" + limit,
	)
	return res
}

export async function getCarById(carId: string) {
	const res = await getFetch(`/api/v1/admin/cars/${carId}`)
	return res
}

export async function updateCarByAdmin(
	data: IAdminUpdateStatus,
	carId: string,
) {
	const res = await putFetch(`/api/v1/admin/cars/${carId}`, data)
	return res
}

export async function getDealerCars(
	dealerId: string,
	pageNum: number,
	limit: number,
) {
	const res = await getFetch(
		`/api/v1/admin/cars/dealer/${dealerId}?pageNum=` +
			pageNum +
			"&limit=" +
			limit,
	)
	return res
}

export async function carStatusData(
	status: Omit<IAdminUpdateStatus, "rejectionReason">,
	pageNum: number,
	limit: number,
) {
	const res = await getFetch(
		`/api/v1/admin/cars/status/${status}?pageNum=` +
			pageNum +
			"&limit=" +
			limit,
	)
	return res
}
