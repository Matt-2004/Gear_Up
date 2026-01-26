"use client"

import { CarItems } from "@/app/types/car.types"
import { formatNumber } from "@/lib/numberFormatter"
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Cog,
	Fuel,
	Gauge,
	Heart,
	Mail,
	Share2
} from "lucide-react"
import { useState } from "react"

export default function CarDetailPage({ car }: { car: CarItems }) {
	const [selectedImage, setSelectedImage] = useState(0)
	const [isFavorite, setIsFavorite] = useState(false)

	const nextImage = () => {
		setSelectedImage((prev) => (prev + 1) % car.carImages.length)
	}

	const prevImage = () => {
		setSelectedImage(
			(prev) => (prev - 1 + car.carImages.length) % car.carImages.length,
		)
	}

	const features = [car.engineCapacity, car.fuelType, car.transmissionType]

	if (!car) {
		return <div>
			Car Data not exists
		</div>
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
			<div className="mx-auto max-w-7xl px-4 py-8">
				{/* Header */}
				<div className="mb-6 rounded-xl bg-white p-6 shadow-lg border border-primary-100">
					<div className="mb-4 flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-3">
								<span className={`px-3 py-1 rounded-full text-xs font-semibold ${car.carStatus === "Available"
									? "bg-primary-200 text-primary-800"
									: "bg-red-100 text-red-800"
									}`}>
									{car.carStatus}
								</span>
								<span className={`px-3 py-1 rounded-full text-xs font-semibold ${car.carCondition === "New"
									? "bg-blue-100 text-blue-800"
									: "bg-gray-200 text-gray-700"
									}`}>
									{car.carCondition}
								</span>
							</div>
							<h1 className="mb-2 text-4xl font-bold text-gray-900">
								{car.year} {car.make} {car.model}
							</h1>
							<p className="text-lg text-gray-600 font-medium">{car.title}</p>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setIsFavorite(!isFavorite)}
								className={`rounded-full p-3 transition-all shadow-md hover:shadow-lg ${isFavorite
									? "bg-red-50 text-red-500"
									: "bg-gray-100 text-gray-600 hover:bg-primary-100"
									}`}
							>
								<Heart
									className="h-5 w-5"
									fill={isFavorite ? "currentColor" : "none"}
								/>
							</button>
							<button className="rounded-full bg-gray-100 p-3 text-gray-600 transition-all shadow-md hover:bg-primary-100 hover:shadow-lg">
								<Share2 className="h-5 w-5" />
							</button>
						</div>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-5xl font-bold text-primary-600">
							${formatNumber(car.price)}
						</span>
						<span className="text-gray-500 text-lg">Baht</span>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Left Column - Images & Details */}
					<div className="space-y-6 lg:col-span-2">
						{/* Image Gallery */}
						<div className="overflow-hidden rounded-xl bg-white shadow-lg border border-primary-100">
							<div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
								<img
									src={car.carImages[selectedImage].url}
									alt={`${car.make} ${car.model}`}
									className="h-full w-full object-cover"
								/>
								<div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
									{selectedImage + 1} / {car.carImages.length}
								</div>
								<button
									onClick={prevImage}
									className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/95 p-2.5 transition-all hover:bg-primary-500 hover:text-white shadow-lg"
								>
									<ChevronLeft className="h-6 w-6" />
								</button>
								<button
									onClick={nextImage}
									className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/95 p-2.5 transition-all hover:bg-primary-500 hover:text-white shadow-lg"
								>
									<ChevronRight className="h-6 w-6" />
								</button>
							</div>
							<div className="grid grid-cols-4 gap-3 p-4">
								{car.carImages.map((img: { url: string }, idx: number) => (
									<button
										key={idx}
										onClick={() => setSelectedImage(idx)}
										className={`aspect-video overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${selectedImage === idx
											? "border-primary-500 shadow-md"
											: "border-gray-200 hover:border-primary-300"
											}`}
									>
										<img
											src={img.url}
											alt=""
											className="h-full w-full object-cover"
										/>
									</button>
								))}
							</div>
						</div>

						{/* Specifications */}
						<div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
							<h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
								<div className="h-1 w-10 bg-primary-500 rounded"></div>
								Key Specifications
							</h2>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-5 border border-primary-200 transition-all hover:shadow-md hover:scale-105">
									<Gauge className="mb-2 h-8 w-8 text-primary-600" />
									<div className="text-sm text-gray-600 font-medium">Mileage</div>
									<div className="font-bold text-gray-900">
										{car.mileage.toLocaleString()} KM
									</div>
								</div>
								<div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-5 border border-primary-200 transition-all hover:shadow-md hover:scale-105">
									<Fuel className="mb-2 h-8 w-8 text-primary-600" />
									<div className="text-sm text-gray-600 font-medium">Fuel Type</div>
									<div className="font-bold text-gray-900">{car.fuelType}</div>
								</div>
								<div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-5 border border-primary-200 transition-all hover:shadow-md hover:scale-105">
									<Cog className="mb-2 h-8 w-8 text-primary-600" />
									<div className="text-sm text-gray-600 font-medium">Transmission</div>
									<div className="font-bold text-gray-900">{car.transmissionType}</div>
								</div>
								<div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-5 border border-primary-200 transition-all hover:shadow-md hover:scale-105">
									<Calendar className="mb-2 h-8 w-8 text-primary-600" />
									<div className="text-sm text-gray-600 font-medium">Year</div>
									<div className="font-bold text-gray-900">{car.year}</div>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
							<h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
								<div className="h-1 w-10 bg-primary-500 rounded"></div>
								Description
							</h2>
							<p className="leading-relaxed text-gray-700 text-lg">{car.description}</p>
						</div>

						{/* Additional Details */}
						<div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
							<h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
								<div className="h-1 w-10 bg-primary-500 rounded"></div>
								Additional Details
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100">
									<span className="text-gray-700 font-medium">Engine Capacity</span>
									<span className="font-bold text-primary-700">{car.engineCapacity}L</span>
								</div>
								<div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100">
									<span className="text-gray-700 font-medium">Seating Capacity</span>
									<span className="font-bold text-primary-700">{car.seatingCapacity} Seats</span>
								</div>
								<div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100">
									<span className="text-gray-700 font-medium">Color</span>
									<span className="font-bold text-primary-700">{car.color}</span>
								</div>
								<div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100">
									<span className="text-gray-700 font-medium">License Plate</span>
									<span className="font-bold text-primary-700">{car.licensePlate}</span>
								</div>
								<div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100 md:col-span-2">
									<span className="text-gray-700 font-medium">VIN</span>
									<span className="font-bold text-primary-700 font-mono">{car.vin}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Contact Seller */}
					<div className="lg:col-span-1">
						<div className="sticky top-8 space-y-4">
							{/* Contact Seller Card */}
							<div className="rounded-xl bg-white p-6 shadow-lg border-2 border-primary-200">
								<div className="mb-6">
									<h3 className="text-2xl font-bold text-gray-900 mb-2">
										Contact Seller
									</h3>
									<p className="text-sm text-gray-600">Get in touch with the seller for more information</p>
								</div>

								<div className="space-y-3">
									<button className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-600 py-4 font-bold text-white transition-all shadow-md hover:bg-primary-700 hover:shadow-lg hover:scale-105 active:scale-100">
										<Calendar className="h-5 w-5" />
										Get a Appointment
									</button>
									<button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border-2 border-primary-500 py-4 font-bold text-primary-700 transition-all shadow-sm hover:bg-primary-50 hover:shadow-md hover:scale-105 active:scale-100">
										<Mail className="h-5 w-5" />
										Send Message
									</button>
								</div>

								<div className="mt-6 pt-6 border-t border-primary-100">
									<div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-4 border border-primary-200">
										<div className="flex items-start gap-3">
											<Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
											<div>
												<div className="text-sm font-bold text-primary-900 mb-1">
													Schedule Test Drive
												</div>
												<div className="text-xs text-primary-700">
													Experience this car in person. Book your test drive today!
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Quick Info Card */}
							<div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
								<h4 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h4>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between items-center pb-2 border-b border-gray-100">
										<span className="text-gray-600">Condition</span>
										<span className="font-bold text-primary-700">{car.carCondition}</span>
									</div>
									<div className="flex justify-between items-center pb-2 border-b border-gray-100">
										<span className="text-gray-600">Status</span>
										<span className="font-bold text-primary-700">{car.carStatus}</span>
									</div>
									<div className="flex justify-between items-center pb-2 border-b border-gray-100">
										<span className="text-gray-600">Validation</span>
										<span className={`font-bold ${car.carValidationStatus === "Approved"
											? "text-green-600"
											: "text-yellow-600"
											}`}>{car.carValidationStatus}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
