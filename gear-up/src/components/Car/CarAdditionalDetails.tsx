import { CarItems } from "@/types/car.types"

interface CarAdditionalDetailsProps {
	car: CarItems
}

export default function CarAdditionalDetails({
	car,
}: CarAdditionalDetailsProps) {
	const details = [
		{ label: "Engine Capacity", value: `${car.engineCapacity}L` },
		{ label: "Seating Capacity", value: `${car.seatingCapacity} Seats` },
		{ label: "Color", value: car.color },
		{ label: "License Plate", value: car.licensePlate },
		{ label: "VIN", value: car.vin, fullWidth: true, mono: true },
	]

	return (
		<div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
			<h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
				<div className="bg-primary-500 h-1 w-10 rounded"></div>
				Additional Details
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{details.map((detail, index) => (
					<div
						key={index}
						className={`border-primary-100 flex items-center justify-between rounded-lg border p-3 ${
							detail.fullWidth ? "md:col-span-2" : ""
						}`}
					>
						<span className="font-medium text-gray-700">{detail.label}</span>
						<span className={`font-semibold`}>{detail.value}</span>
					</div>
				))}
			</div>
		</div>
	)
}
