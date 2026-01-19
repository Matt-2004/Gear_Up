import AddNewCar from "./AddNewCar"
import VehicleContextProvider from "./AddNewCarContext"

const Page = async ({
	searchParams,
}: {
	searchParams: Promise<{ step: string }>
}) => {
	const param = await searchParams
	return (
		<VehicleContextProvider>
			<AddNewCar step={param.step} />
		</VehicleContextProvider>
	)
}

export default Page
