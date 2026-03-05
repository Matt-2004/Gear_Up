import { CarItems } from "@/types/car.types"
import { getCarById } from "@/utils/API/CarAPI"
import { Metadata } from "next"
import HomeCarDetailPage from "./HomeCarDetailPage"

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>
}): Promise<Metadata> {
	const { id } = await params
	try {
		const car = await getCarById(id)
		const carData = car?.data
		return {
			title: carData
				? `${carData.make} ${carData.model} ${carData.year} - Gear Up`
				: "Car Details - Gear Up",
			description: carData
				? `${carData.title} - ${carData.description?.substring(0, 150)}`
				: "View car details on Gear Up",
		}
	} catch {
		return {
			title: "Car Details - Gear Up",
			description: "View car details on Gear Up",
		}
	}
}

async function getData(id: string) {
	try {
		const res = await getCarById(id)
		return res?.data
	} catch (error) {
		console.error("Error fetching user profile:", error)
		throw error
	}
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const car = (await getData(id)) as CarItems

	return <HomeCarDetailPage car={car} />
}

export default Page
