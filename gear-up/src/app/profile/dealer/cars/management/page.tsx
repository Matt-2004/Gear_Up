"use server"

import { CarRoot } from "@/app/types/car.types"
import { getAllCars } from "@/utils/API/CarAPI"
import CarManagementPage from "./CarManagementPage"

// fetch the car data
export async function getData(id: number) {
	"use server"
	try {
		const res = await getAllCars(id)
		return res?.data
	} catch (error) {
		console.error("Error fetching user profile:", error)
		throw error
	}
}

const Page = async () => {
	const car = (await getData(1)) as CarRoot

	return <CarManagementPage car={car.data.items} />
}

export default Page
