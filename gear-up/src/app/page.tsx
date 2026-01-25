import { CarGrid } from "@/components/Car/CarGrid"
import { getAllCars } from "@/utils/FetchAPI"

export default async function HOME() {
	let cars = []

	try {
		const response = await getAllCars(1)
		cars = response?.items || []
	} catch (error) {
		console.error("Failed to fetch cars:", error)
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<CarGrid cars={cars} />
		</main>
	)
}
