import { CarDetailData } from "@/app/types/car.types"
import { getCarById } from "@/utils/FetchAPI"
import CarDetailPage from "./CarDetailPage"

async function getData(id: string) {
	try {
		const res = await getCarById(id)
		return res
	} catch (error) {
		console.error("Error fetching user profile:", error)
		throw error
	}
}

const Page = async ({ params }: { params: { id: string } }) => {
	const { id } = params
	const car = (await getData(id)) as CarDetailData

	return <CarDetailPage car={car.data} />
}

export default Page
