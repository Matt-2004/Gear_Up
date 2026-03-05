import { CarItems } from "@/types/car.types"
import { getCarById } from "@/utils/API/CarAPI"
import AppointmentPage from "./AppointmentPage"

async function getData(id: string) {
	try {
		const res = await getCarById(id)
		return res?.data
	} catch (error) {
		console.error("Error fetching car data:", error)
		throw error
	}
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const car = (await getData(id)) as CarItems

	return <AppointmentPage car={car} />
}

export default Page
