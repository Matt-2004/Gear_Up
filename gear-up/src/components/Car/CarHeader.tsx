import { CarItems } from "@/types/car.types"
import { formatNumber } from "@/lib/numberFormatter"
import { Heart } from "lucide-react"

interface CarHeaderProps {
	car: CarItems
	isFavorite: boolean
	onToggleFavorite: () => void
}

export default function CarHeader({
	car,
	isFavorite,
	onToggleFavorite,
}: CarHeaderProps) {
	return (
		<div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
			<div className="mb-4 flex items-start justify-between">
				<div className="flex-1">
					<div className="mb-3 flex items-center gap-2">
						<span
							className={`rounded-full px-3 py-1 text-xs font-semibold ${
								car.carStatus === "Available"
									? "bg-primary-200 text-primary-800"
									: "bg-red-100 text-red-800"
							}`}
						>
							{car.carStatus}
						</span>
						<span
							className={`rounded-full px-3 py-1 text-xs font-semibold ${
								car.carCondition === "New"
									? "bg-blue-100 text-blue-800"
									: "bg-gray-200 text-gray-700"
							}`}
						>
							{car.carCondition}
						</span>
					</div>
					<h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
						{car.year} {car.make} {car.model}
					</h1>
					<p className="text-base font-medium text-gray-600 sm:text-lg">
						{car.title}
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={onToggleFavorite}
						className={`cursor-pointer rounded-full p-3 transition-all hover:shadow-sm ${
							isFavorite ? "bg-red-50 text-red-500" : ""
						}`}
					>
						<Heart
							className="h-5 w-5"
							fill={isFavorite ? "currentColor" : "none"}
						/>
					</button>
				</div>
			</div>
			<div className="flex items-baseline gap-2">
				<span className="text-3xl font-bold text-orange-500 sm:text-4xl md:text-5xl">
					฿{formatNumber(car.price)}
				</span>
				<span className="text-base text-gray-500 sm:text-lg">Baht</span>
			</div>
		</div>
	)
}
