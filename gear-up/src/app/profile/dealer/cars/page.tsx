"use client"

import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { getFakeCars } from "@/utils/FetchAPI"
import { Car } from "@/app/types/car.types"
import clsx from "clsx"
import { CarFront, Fuel, PaintBucket, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

const Page = () => {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const { data } = useQuery({
		queryKey: ["car"],
		queryFn: getFakeCars,
		enabled: true,
	})

	console.log("Car Data:: ", data?.data)

	return (
		<div
			id={"car-main-container"}
			className={
				"flex h-full w-full flex-col items-center justify-center text-white"
			}
		>
			<div className={"lg:w-[90%] xl:w-[75%]"}>
				<div className={"flex items-center justify-between py-4"}>
					<div className={""}>
						<h1 className={"text-2xl font-semibold"}>Dashboard</h1>
						<h3 className={"text-sm text-gray-300"}>
							Manage your inventory, sales, and performance all in one place.
						</h3>
					</div>
				</div>
				<div
					id={"car-container"}
					className={"flex h-full w-full md:justify-between"}
				>
					<div
						id={"left-side-container"}
						className={
							"bg-background h-full w-full rounded-sm border-gray-800 pb-4 shadow-sm shadow-gray-600 md:w-[73%]"
						}
					>
						<div
							id={"header"}
							className={"flex items-center justify-between p-4"}
						>
							<h1 className={"text-lg font-semibold"}>Available Cars</h1>
							{/*This part need to add filter component*/}
							<div
								onClick={() => setIsFilterOpen((prevState) => !prevState)}
								className="flex cursor-pointer items-center gap-2 border border-gray-600 px-4 py-2 hover:bg-gray-600"
							>
								<SlidersHorizontal className="h-5 w-5" />
								Filter
							</div>
						</div>
						{isFilterOpen && (
							<div
								id="conditionalFilter"
								className="flex w-full justify-center"
							>
								<ConditionalCarFilter />
							</div>
						)}
						<div id={"cars"} className={"mt-2 flex w-full justify-center"}>
							<div
								className={
									"grid w-[95%] auto-cols-max grid-cols-2 gap-4 lg:grid-cols-3"
								}
							>
								{data &&
									data.data.items.slice(0, 9).map((car: Car, index: number) => (
										<div key={index} className="last:hidden lg:last:block">
											<CarCard car={car} />
										</div>
									))}
							</div>
						</div>
					</div>
					<div
						id={"right-side-container"}
						className={
							"bg-background hidden h-screen w-[25%] rounded-sm border-gray-800 shadow-sm shadow-gray-600 md:block"
						}
					>
						# Need to add analytics component here #
					</div>
				</div>
			</div>
		</div>
	)
}

function CarCard({ car }: { car: Car }) {
	return (
		<div
			className={
				"flex h-full w-full flex-col rounded-sm border border-gray-600 bg-gray-800 shadow-gray-800"
			}
		>
			<div className={"space-y-2 p-3"}>
				<Image
					className={"h-30 w-full object-cover"}
					src={car.carImages[0]?.url}
					alt={"car"}
					width={"100"}
					height={"50"}
				></Image>
				<div
					id={"titleAndSave"}
					className={"flex items-center justify-between"}
				>
					<h1>{car.title}</h1>
					<h3
						className={clsx(
							car.carStatus === "Available" ? "bg-green-600" : "bg-red-500",
							"items-center rounded-md px-2 py-0.5 text-xs",
						)}
					>
						{car.carStatus}
					</h3>
				</div>
				<div
					id={"features"}
					className={"hidden flex-col justify-between md:flex md:flex-row"}
				>
					<h1 className={"flex items-center gap-1 text-xs md:text-sm"}>
						<CarFront className="h-5 w-5" /> <b>{car.make}</b>
					</h1>
					<h1 className={"flex items-center gap-1 text-xs md:text-sm"}>
						<Fuel className="h-5 w-5" /> <b>{car.fuelType}</b>
					</h1>
					<h1 className={"flex items-center gap-1 text-xs md:text-sm"}>
						<PaintBucket className="h-5 w-5" />

						<div
							className={clsx(
								`h-5 w-5 bg-${car.color.toLowerCase()}-500 `,
								`bg-${car.color.toLowerCase()}`,
							)}
						/>
					</h1>
				</div>
				<div id={"price"} className={"text-primary text-lg font-semibold"}>
					${car.price.toString().split(".")[0]}
				</div>
			</div>
		</div>
	)
}

export function ConditionalCarFilter() {
	return (
		<div
			id={"filter-container"}
			className={
				"flex w-[95%] flex-col justify-center gap-2 rounded-sm border border-dashed border-gray-600 px-4 py-2"
			}
		>
			{/* Placeholder for future filter options */}
			<div id="year" className={"items-center text-gray-300"}>
				<h1>
					Year:{" "}
					<input
						type="number"
						name="year"
						placeholder="1990"
						min={1990}
						max={2025}
						className={
							"w-20 rounded-sm border border-gray-600 bg-gray-800 p-1 text-white placeholder:text-sm focus:outline-none"
						}
					/>{" "}
					to{" "}
					<input
						type="number"
						placeholder="2025"
						name="year"
						min={1990}
						max={2025}
						className={
							"w-20 rounded-sm border border-gray-600 bg-gray-800 p-1 text-white placeholder:text-sm focus:outline-none"
						}
					/>
				</h1>
			</div>
			<div className="h-0.5 w-full border border-gray-600" />
			<div id="price" className={"items-center text-gray-300"}>
				<h1>
					Price range:{" "}
					<input
						type="number"
						name="price"
						placeholder="$5000 - min"
						className={
							"w-28 rounded-sm border border-gray-600 bg-gray-800 p-1 text-white placeholder:text-sm focus:outline-none"
						}
					/>{" "}
					to{" "}
					<input
						type="number"
						placeholder="$20000 - max"
						name="price"
						className={
							"w-28 rounded-sm border border-gray-600 bg-gray-800 p-1 text-white placeholder:text-sm focus:outline-none"
						}
					/>
				</h1>
			</div>
			<div className="h-0.5 w-full border border-gray-600" />
			<div className="flex items-center gap-1">
				Brand
				<div className="flex items-center gap-1 select-none">
					<input
						id="tesla"
						type="checkbox"
						name="make"
						value="Toyota"
						className="peer hidden appearance-none"
					/>
					<label
						htmlFor="tesla"
						className="peer-checked:bg-primary ml-1 flex cursor-pointer gap-1 rounded-sm border border-gray-600 bg-white px-2 py-2 text-red-500"
					>
						<div className="relative h-5 w-16">
							<Image
								src="/tesla-text.png"
								alt="toyota"
								fill
								className="object-contain"
							/>
						</div>
					</label>
				</div>
				<div className="flex items-center gap-1 select-none">
					<input
						id="toyota"
						type="checkbox"
						name="make"
						value="Toyota"
						className="peer hidden appearance-none"
					/>
					<label
						htmlFor="toyota"
						className="peer-checked:bg-primary ml-1 flex cursor-pointer gap-1 rounded-sm border border-gray-600 bg-white px-2 py-2 text-red-500"
					>
						<div className="relative h-5 w-16">
							<Image
								src="/toyota-text.png"
								alt="toyota"
								fill
								className="scale-200 object-contain"
							/>
						</div>
					</label>
				</div>
			</div>
		</div>
	)
}

export default Page
