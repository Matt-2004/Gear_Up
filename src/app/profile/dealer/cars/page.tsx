// Dealer car inventory page

import { CarItems } from "@/types/car.types"
import { CursorBaseDTO } from "@/types/post.types"
import { getMyCars } from "@/utils/API/CarAPI"
import DealerCarDashboard from "./DealerCarDashboard"

export const dynamic = "force-dynamic"

// Fetch cars by status
async function getCarsByStatus(status: string) {
	try {
		const res = await getMyCars(status, null)
		return res?.data
	} catch (error) {
		console.error(`Error fetching ${status} cars:`, error)
		return null
	}
}

// Fetch all cars (Pending, Approved, Rejected) and combine into CursorBaseDTO format
async function getAllStatusCars(): Promise<
	Omit<CursorBaseDTO, "items"> & { items: CarItems[] }
> {
	try {
		const [pendingData, approvedData, rejectedData] = await Promise.all([
			getCarsByStatus("Pending"),
			getCarsByStatus("Approved"),
			getCarsByStatus("Rejected"),
		])

		console.log(pendingData, approvedData, rejectedData)
		// Combine all cars from different statuses into items array
		const allCars: Omit<CursorBaseDTO, "items"> & { items: CarItems[] } = {
			items: [
				...pendingData?.items,
				...approvedData?.items,
				...rejectedData?.items,
			],
			hasMore: false,
			nextCursor: "",
		}
		console.log("All cars combined:", allCars)
		// Return in CursorBaseDTO format
		return {
			items: allCars.items,
			hasMore: false,
			nextCursor: "",
		}
	} catch (error) {
		console.error("Error fetching all status cars:", error)
		return {
			items: [],
			hasMore: false,
			nextCursor: "",
		}
	}
}

const Page = async () => {
	const cars = await getAllStatusCars()

	return <DealerCarDashboard carData={cars} />
}

export default Page
