"use client"

import { PostContent } from "@/app/post/discover/DiscoverPost"
import { CarImages, CarItems } from "@/app/types/car.types"
import { CarCard } from "@/components/Car/CarCard"
import Button from "@/components/Common/Button"
import clsx from "clsx"
import { ReactNode, useEffect, useState } from "react"
import { useVehicleContext } from "./AddNewCarContext"

type ContainCarImagesType = Omit<CarItems, "carImages"> & {
	carImages: CarImages[]
}

const Review = () => {
	const { addedCar } = useVehicleContext()
	const [testData, setTestData] = useState<CarItems>({
		id: "1234",
		title: "Toyota Carmy 2.0",
		description:
			"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
		model: "Camry",
		make: "Toyota",
		year: 2024,
		price: 1250000,
		color: "White",
		mileage: 45000,
		seatingCapacity: 4,
		engineCapacity: 2.0,
		carImages: [],
		fuelType: "Petrol",
		carCondition: "New",
		transmissionType: "Manual",
		carStatus: "Available",
		carValidationStatus: "Clean",
		vin: "12345678910",
		licensePlate: "BMW-6733",
	})

	const { make, model, year, color } = testData
	const basicSpecTableData = [
		{ Make: make },
		{ Model: model },
		{ Year: year },
		{ Color: color },
	]

	const { engineCapacity, fuelType, transmissionType } = testData
	const performanceSpecTableData = [
		{ EngineCapacity: engineCapacity },
		{ FuelType: fuelType },
		{ TransmissionType: transmissionType },
	]

	const { mileage, seatingCapacity } = testData
	const capacitySpecTableData = [
		{ Mileage: mileage },
		{ SeatingCapacity: seatingCapacity },
	]

	const [carData, setCarData] = useState<CarItems>()
	useEffect(() => {
		if (!addedCar) return
		const data: ContainCarImagesType = {
			...addedCar,
			carImages: addedCar.carImages.map((file) => ({
				id: "",
				carId: "",
				url: URL.createObjectURL(file),
			})),
		}
		setCarData(data)
	}, [addedCar])

	// File[] type to  CarImges[]

	return (
		<form className="w-full rounded-xl border border-gray-300 bg-white py-4">
			<div className="mx-auto w-7/8 space-y-12">
				<div className="space-y-2">
					<h1 className="text-xl font-semibold">Review your informaton</h1>
					<h6 className="text-sm text-gray-500">
						Please review your information carefully. This is how your car will
						appear to buyers.
					</h6>
				</div>
				<div className="flex justify-center">
					<CarCard carItem={testData!!} />
					{/* ItemCard data will use the addNewCarContext data... */}
				</div>
				{/* Item Card as a sample */}
				{/* Uploaded Images in grid styles*/}
				<div>
					<h1 className="mb-8 text-xl font-semibold">Basic Information</h1>
					<div className="grid w-full grid-cols-2 items-start">
						<div className="flex w-full items-center gap-2">
							<h6 className="text-sm text-gray-600">Title -</h6>
							<h1 className="text-sm">{testData.title}</h1>
						</div>
						<div className="flex w-full gap-2">
							<h6 className="text-sm text-gray-600">Description: </h6>

							<PostContent postContent={testData.description} />
						</div>
					</div>
					{/* Check box for alerting checking information */}
				</div>
				<div>
					<h1 className="mb-8 text-xl font-semibold">Vehicle Specifications</h1>
					<div className="flex w-full flex-col items-center space-y-8">
						<div className="flex flex-col gap-1">
							<h3 className="text-sm font-semibold">Basic</h3>
							<table className="w-xs border border-gray-200">
								<tbody>
									{basicSpecTableData.map((d, i) => {
										const [key, value] = Object.entries(d)[0]

										return (
											<TableRow key={i} index={i}>
												<td className="max-w-[3.5rem] pl-2">{key}</td>
												<td className="">{value}</td>
											</TableRow>
										)
									})}
								</tbody>
							</table>
						</div>
						<div className="flex flex-col gap-1">
							<h3 className="text-sm font-semibold">Performance</h3>
							<table className="w-xs border border-gray-200">
								<tbody>

									{performanceSpecTableData.map((d, i) => {
										const [key, value] = Object.entries(d)[0]

										return (
											<TableRow key={i} index={i}>
												<td className="max-w-[3.5rem] pl-2">{key}</td>
												<td className="">{value}</td>
											</TableRow>
										)
									})}
								</tbody>
							</table>
						</div>
						<div className="flex flex-col gap-1">
							<h3 className="text-sm font-semibold">Capacity</h3>
							<table className="w-xs border border-gray-200">
								<tbody>

									{capacitySpecTableData.map((d, i) => {
										const [key, value] = Object.entries(d)[0]

										return (
											<TableRow key={i} index={i}>
												<td className="max-w-[3.5rem] pl-2">{key}</td>
												<td className="">{value}</td>
											</TableRow>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<Button>Next</Button>
			</div>
		</form>
	)
}

export const TableRow = ({ index, children }: { index: number, children: ReactNode }) => {
	return (


		<tr
			className={clsx(
				index % 2 == 0 ? "bg-[#F9F9F9]" : "bg-[#F1F1F1]",
				"h-8 text-sm text-gray-600 ",
			)}
		>
			{children}
		</tr>

	)
}

export default Review
