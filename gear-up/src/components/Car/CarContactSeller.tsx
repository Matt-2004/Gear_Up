import { CarItems } from "@/types/car.types"
import { Calendar, CircleCheckBig, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface CarContactSellerProps {
	car: CarItems
}

export default function CarContactSeller({ car }: CarContactSellerProps) {
	const router = useRouter()

	return (
		<div className="space-y-2 sm:sticky sm:top-8">
			{/* Contact Seller Card */}
			<div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
				<div className="mb-4 sm:mb-6">
					<h3 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
						Contact Seller
					</h3>
					<p className="text-sm text-gray-600">
						Get in touch with the seller for more information
					</p>
				</div>

				<div className="">
					<button
						onClick={() => router.push(`/car/${car.id}/appointment`)}
						className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center gap-3 rounded-xl py-4 font-bold text-white shadow-md transition-all hover:scale-105 hover:cursor-pointer hover:shadow-lg active:scale-100"
					>
						<Calendar className="h-5 w-5" />
						Get a Appointment
					</button>
				</div>

				<div className="mt-6 pt-6">
					<div className="rounded-lg border border-blue-500 bg-blue-100 p-4">
						<div className="flex items-start gap-3">
							<Calendar className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
							<div>
								<div className="mb-1 text-sm font-bold text-blue-600">
									Schedule Test Drive
								</div>
								<div className="text-xs text-blue-700">
									Experience this car in person. Book your test drive today!
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Info Card */}
			<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
				<h4 className="mb-4 text-lg font-bold text-gray-900">Quick Info</h4>
				<div className="space-y-3 text-sm">
					<div className="flex items-center justify-between border-b border-gray-100 pb-2">
						<span className="text-gray-600">Condition</span>
						<span className="font-semibold">{car.carCondition}</span>
					</div>
					<div className="flex items-center justify-between border-b border-gray-100 pb-2">
						<span className="text-gray-600">Status</span>
						<span className="font-semibold">{car.carStatus}</span>
					</div>
					<div className="flex items-center justify-between border-b border-gray-100 pb-2">
						<span className="text-gray-600">Validation</span>
						<span
							className={`font-bold ${
								car.carValidationStatus === "Approved"
									? "text-green-600"
									: "text-yellow-600"
							}`}
						>
							{car.carValidationStatus === "Approved" ? (
								<CircleCheckBig className="mr-1 inline-block h-5 w-5" />
							) : (
								<Clock className="mr-1 inline-block h-5 w-5" />
							)}
							{car.carValidationStatus}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
