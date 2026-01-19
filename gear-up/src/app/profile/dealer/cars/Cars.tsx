"use client"

import { CarItems } from "@/app/types/car.types"
import { DropDownItem } from "@/components/Navbar/NavbarDropDown"
import clsx from "clsx"
import {
	BadgeDollarSign,
	CarFront,
	Fuel,
	Gauge,
	GripVertical,
	Hourglass,
	Settings2,
	SlidersHorizontal,
	Trash2,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { FormEvent, useState } from "react"

const Cars = ({ carData }: { carData: CarItems[] }) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [selectedId, setSelectedId] = useState<number | undefined>(undefined)

	const handleSelectId = (
		e: FormEvent<HTMLButtonElement | HTMLUListElement>,
		type: "OnEnter" | "OnLeave",
	) => {
		if (type === "OnEnter") {
			const id = e.currentTarget.id
			setSelectedId(Number(id))
		}
		if (type === "OnLeave") {
			setSelectedId(undefined)
		}
	}

	return (
		<div id={"car-main-container"} className={"min-w-screen sm:md:px-4"}>
			<div className={"mx-auto lg:w-[90%] xl:w-[75%]"}>
				<div className={"flex items-center justify-between py-4"}>
					<div className={""}>
						<h1 className={"text-3xl font-semibold"}>Dashboard</h1>
						<h3 className={"text-sm text-gray-500"}>
							Manage your inventory, sales, and performance all in one place.
						</h3>
					</div>
				</div>
				<div
					id={"car-container"}
					className={"flex w-full flex-col gap-4 md:justify-between"}
				>
					<div
						id={"left-side-container"}
						className={"w-full rounded-xl bg-white pb-4 shadow-sm"}
					>
						<div
							id={"header"}
							className={"flex items-center justify-between p-4"}
						>
							<h1 className={"text-lg font-semibold"}>Available Cars</h1>
							{/*This part need to add filter component*/}
							<div
								onClick={() => setIsFilterOpen((prevState) => !prevState)}
								className="hover:bg-primary-btn-hover hover:text-primary flex cursor-pointer items-center gap-2 rounded-xl border border-gray-50 px-4 py-2 shadow-md select-none"
							>
								<SlidersHorizontal className="h-5 w-5" />
								Filter
							</div>
						</div>
						{isFilterOpen && (
							<div id="conditionalFilter" className="w-full">
								<ConditionalCarFilter />
							</div>
						)}
						{/* FIXME: Grid Layout not fit with container */}
						<div id={"cars"} className={"mt-2 flex w-full justify-center p-4"}>
							<div
								className={
									"grid w-full auto-cols-max grid-cols-3 justify-items-start"
								}
							>
								{carData &&
									carData.map((car: CarItems, index: number) => (
										<CarCard
											car={car}
											id={index}
											selectedId={selectedId}
											handleClick={handleSelectId}
										/>
									))}
							</div>
						</div>
					</div>
					<div
						id={"right-side-container"}
						className={"hidden w-[25%] rounded-sm bg-white shadow-sm md:block"}
					>
						<h1>Add Car button</h1>
						<h1>Appointment overview</h1>
						<h1>Chatbox overview</h1>
					</div>
				</div>
			</div>
		</div>
	)
}

interface ICarCardProps {
	car: CarItems
	id: number
	selectedId: number | undefined
	handleClick: (
		e: FormEvent<HTMLButtonElement | HTMLUListElement>,
		type: "OnEnter" | "OnLeave",
	) => void
}

function CarCard({ car, id, selectedId, handleClick }: ICarCardProps) {
	const router = useRouter()

	const formatNumber = (num: number) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}
	return (
		<div
			key={id}
			className={
				"relative z-20 flex h-[21rem] w-72 flex-col rounded-xl bg-white shadow-sm shadow-gray-300"
			}
		>
			<button
				id={id.toString()}
				onMouseEnter={(e) => handleClick(e, "OnEnter")}
				className="absolute top-0 right-0 z-20 rounded-tr-xl rounded-bl-lg bg-gray-100 p-1 opacity-80 active:bg-gray-300"
			>
				<GripVertical className="h-5 w-5" />
			</button>

			<ul
				onMouseLeave={(e) => handleClick(e, "OnLeave")}
				className={clsx(
					selectedId === id ? "z-30 opacity-100" : "z-10 opacity-0",
					"absolute top-0 right-0 w-36 space-y-1 rounded-tr-xl rounded-bl-xl bg-white p-1 transition-opacity duration-150 ease-out",
				)}
			>
				{/* TODO: When click redirect to Car's Edit Page */}
				<DropDownItem whatFor="Card">
					<button className="flex items-center gap-1">
						<Settings2 className="h-4 w-4" />
						Edit
					</button>
				</DropDownItem>
				{/* TODO: Make Toggle Suspense */}
				<DropDownItem whatFor="Card">
					<button className="flex items-center gap-1">
						<Hourglass className="h-3.5 w-3.5" />
						Suspense
					</button>
				</DropDownItem>

				{/* TODO: Make DELETE Function  */}
				<DropDownItem type="DELETE" whatFor="Card">
					<button className="flex items-center gap-1">
						<Trash2 className="h-4 w-4" />
						Delete
					</button>
				</DropDownItem>
			</ul>

			<div
				className={"space-y-2"}
				onClick={() => router.push(`/profile/dealer/cars/${car.id}`)}
			>
				<Image
					className={"h-52 w-full rounded-tl-xl rounded-tr-xl object-cover"}
					src={car.carImages[0]?.url}
					alt={"car"}
					width={160}
					height={160}
				></Image>
				<div className="space-y-3 px-4 py-2">
					<div
						id={"titleAndSave"}
						className={"flex items-center justify-between"}
					>
						<h1 className="text-xl font-semibold text-black">{car.title}</h1>
						<h3
							className={clsx(
								car.carStatus === "Available"
									? "bg-green-600 text-green-100"
									: "bg-red-500",
								"items-center rounded-full px-2 py-1 text-xs",
							)}
						>
							{car.carStatus === "Available" ? (
								<p className="flex items-center gap-1">
									<BadgeDollarSign className="h-4 w-4" />
									For Sale
								</p>
							) : (
								car.carStatus
							)}
						</h3>
					</div>
					<div
						id={"features"}
						className={"hidden flex-col justify-between md:flex md:flex-row"}
					>
						<h1
							className={
								"flex items-center gap-1 text-xs font-normal md:text-sm"
							}
						>
							<CarFront className="h-5 w-5 text-gray-400" />
							{car.make}
						</h1>
						<h1
							className={
								"flex items-center gap-1 text-xs font-normal md:text-sm"
							}
						>
							<Fuel className="h-5 w-5 text-gray-400" />
							{car.fuelType}
						</h1>
						<h1
							className={
								"flex items-center gap-1 text-xs font-normal md:text-sm"
							}
						>
							<Gauge className="h-5 w-5 text-gray-400" />
							{formatNumber(car.mileage)}
						</h1>
					</div>
					<div>
						<div id={"price"} className={"text-primary text-xl font-bold"}>
							${formatNumber(Number(car.price.toString().split(".")[0]))}.00
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function ConditionalCarFilter() {
	return (
		<div id={"filter-container"} className={"mx-auto w-[95%]"}>
			<div className="flex w-full flex-col justify-center gap-2 rounded-xl border border-dashed border-gray-400 px-4 py-2">
				{/* Placeholder for future filter options */}
				<div id="year" className={"items-center text-gray-500"}>
					<h1>
						Year:{" "}
						<input
							type="number"
							name="year"
							placeholder="1990"
							min={1990}
							max={2025}
							className={
								"w-20 rounded-sm border border-gray-200 bg-gray-100 p-1 text-gray-500 placeholder:text-sm focus:outline-none"
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
								"w-20 rounded-sm border border-gray-200 bg-gray-100 p-1 text-gray-500 placeholder:text-sm focus:outline-none"
							}
						/>
					</h1>
				</div>
				<div className="h-px w-full bg-gray-400" />
				<div id="price" className={"items-center text-gray-500"}>
					<h1>
						Price range:{" "}
						<input
							type="number"
							name="price"
							placeholder="$5,000(min)"
							className={
								"w-28 rounded-sm border border-gray-200 bg-gray-100 p-1 text-gray-500 placeholder:text-sm focus:outline-none"
							}
						/>{" "}
						to{" "}
						<input
							type="number"
							placeholder="$20,000(max)"
							name="price"
							className={
								"w-28 rounded-sm border border-gray-200 bg-gray-100 p-1 text-gray-500 placeholder:text-sm focus:outline-none"
							}
						/>
					</h1>
				</div>
				<div className="h-px w-full bg-gray-400" />
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
		</div>
	)
}

export default Cars
