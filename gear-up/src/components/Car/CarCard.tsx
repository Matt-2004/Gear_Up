import { CarItems } from "@/app/types/car.types"
import { formatNumber } from "@/lib/numberFormatter"
import Image from "next/image"

export function CarCard({ carItem }: { carItem: CarItems }) {
	return (
		<section className="shadow-background flex w-[18rem] flex-col space-y-1 rounded-xl bg-[#f5f5f5] shadow-sm">
			<Image
				src={carItem?.carImages[0]?.url ?? "/carPlaceholderImage.jpg"}
				height={350}
				width={350}
				alt={"this is image"}
				className="w-full rounded-tl-xl rounded-tr-xl object-cover"
			/>
			<div className="w-full px-3 pt-1">
				<div className="flex items-center justify-between">
					<h1 className="text-lg font-semibold">{carItem.title}</h1>
					<div id="badge" className="rounded-full bg-orange-100 px-3 py-1">
						<p className="text-xs font-medium text-orange-500">For Sale</p>
					</div>
				</div>
				<h6 className="text-xs text-gray-500">
					{carItem.model} {carItem.year}
				</h6>
			</div>
			<div id="divider" className="bg-border-400 h-px w-full" />
			<div className="w-full px-3">
				<div className="mx-auto flex w-full items-center justify-center gap-3 rounded-full bg-white py-1">
					<div className="flex items-center gap-1">
						<CogIcon />
						<h3 className="text-xs text-orange-500">
							{carItem.transmissionType}
						</h3>
					</div>
					<div className="flex items-center gap-1">
						<RoadIcon />
						<h3 className="flex items-center gap-1 text-xs text-orange-500">
							{carItem.mileage}
							<p className="text-xs font-light text-gray-500">KM</p>
						</h3>
					</div>
					<div className="flex items-center gap-1">
						<SeatIcon />
						<h3 className="flex items-center gap-1 text-xs text-orange-500">
							{carItem.seatingCapacity}
							<p className="text-xs font-light text-gray-500">Seats</p>
						</h3>
					</div>
				</div>
			</div>
			<div id="divider" className="bg-border-400 h-px w-full" />
			<h1 className="text-primary px-3 py-2 text-xl font-semibold">
				฿ {formatNumber(carItem.price)}
			</h1>
		</section>
	)
}

const CogIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
		>
			<g
				fill="none"
				stroke="#FF7B00"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1"
			>
				<path d="M11 10.27L7 3.34m4 10.39l-4 6.93M12 22v-2m0-18v2m2 8h8m-5 8.66l-1-1.73m1-15.59l-1 1.73M2 12h2m16.66 5l-1.73-1m1.73-9l-1.73 1M3.34 17l1.73-1M3.34 7l1.73 1" />
				<circle cx="12" cy="12" r="2" />
				<circle cx="12" cy="12" r="8" />
			</g>
		</svg>
	)
}

const RoadIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
		>
			<path
				fill="#FF7B00"
				d="M5 19V5h1v14zm6.5 0v-3.077h1V19zm6.5 0V5h1v14zm-6.5-5.462v-3.076h1v3.077zm0-5.461V5h1v3.077z"
			></path>
		</svg>
	)
}

const SeatIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={18}
			height={18}
			viewBox="0 0 24 24"
		>
			<path
				fill="#FF7B00"
				d="M5.35 5.64c-.9-.64-1.12-1.88-.49-2.79c.64-.9 1.88-1.12 2.79-.49c.9.64 1.12 1.88.49 2.79c-.64.9-1.88 1.12-2.79.49M16 19H8.93c-1.48 0-2.74-1.08-2.96-2.54L4 7H2l2 9.76A4.99 4.99 0 0 0 8.94 21H16m.23-6h-4.88l-1.03-4.1c1.58.89 3.28 1.54 5.15 1.22V10c-1.63.3-3.44-.28-4.69-1.26L9.14 7.47c-.23-.18-.49-.3-.76-.38a2.2 2.2 0 0 0-.99-.06h-.02a2.27 2.27 0 0 0-1.84 2.61l1.35 5.92A2.99 2.99 0 0 0 9.83 18h6.85l3.82 3l1.5-1.5"
			></path>
		</svg>
	)
}
