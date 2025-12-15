"use client"

import { Items } from "@/app/types/car.types"
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Cog,
	Fuel,
	Gauge,
	Heart,
	Mail,
	MapPin,
	Phone,
	Share2,
} from "lucide-react"
import { useState } from "react"

export default function CarDetailPage({ car }: { car: Items }) {
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

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-7xl px-4 py-8">
				{/* Header */}
				<div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-start justify-between">
						<div>
							<h1 className="mb-2 text-3xl font-bold text-gray-900">
								{car.year} {car.make} {car.model}
							</h1>
							<div className="flex items-center text-gray-600">
								<MapPin className="mr-1 h-4 w-4" />
								{/* <span>{car.location}</span> */}
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={() => setIsFavorite(!isFavorite)}
								className={`rounded-full p-3 transition ${
									isFavorite
										? "bg-red-50 text-red-500"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								<Heart
									className="h-5 w-5"
									fill={isFavorite ? "currentColor" : "none"}
								/>
							</button>
							<button className="rounded-full bg-gray-100 p-3 text-gray-600 transition hover:bg-gray-200">
								<Share2 className="h-5 w-5" />
							</button>
						</div>
					</div>
					<div className="text-4xl font-bold text-blue-600">
						${car.price.toLocaleString()}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Left Column - Images & Details */}
					<div className="space-y-6 lg:col-span-2">
						{/* Image Gallery */}
						<div className="overflow-hidden rounded-lg bg-white shadow-sm">
							<div className="relative aspect-video bg-gray-900">
								<img
									src={car.carImages[selectedImage].url}
									alt={`${car.make} ${car.model}`}
									className="h-full w-full object-cover"
								/>
								<button
									onClick={prevImage}
									className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-2 transition hover:bg-white"
								>
									<ChevronLeft className="h-6 w-6" />
								</button>
								<button
									onClick={nextImage}
									className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-2 transition hover:bg-white"
								>
									<ChevronRight className="h-6 w-6" />
								</button>
							</div>
							<div className="grid grid-cols-4 gap-2 p-4">
								{car.carImages.map((img, idx) => (
									<button
										key={idx}
										onClick={() => setSelectedImage(idx)}
										className={`aspect-video overflow-hidden rounded border-2 transition ${
											selectedImage === idx
												? "border-blue-500"
												: "border-transparent"
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
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<h2 className="mb-4 text-2xl font-bold text-gray-900">
								Specifications
							</h2>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
									<Gauge className="mb-2 h-8 w-8 text-blue-500" />
									<div className="text-sm text-gray-600">Mileage</div>
									<div className="font-semibold">
										{car.mileage.toLocaleString()} mi
									</div>
								</div>
								<div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
									<Fuel className="mb-2 h-8 w-8 text-blue-500" />
									<div className="text-sm text-gray-600">Fuel Type</div>
									<div className="font-semibold">{car.fuelType}</div>
								</div>
								<div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
									<Cog className="mb-2 h-8 w-8 text-blue-500" />
									<div className="text-sm text-gray-600">Transmission</div>
									<div className="font-semibold">{car.transmissionType}</div>
								</div>
								<div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
									<Calendar className="mb-2 h-8 w-8 text-blue-500" />
									<div className="text-sm text-gray-600">Year</div>
									<div className="font-semibold">{car.year}</div>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<h2 className="mb-4 text-2xl font-bold text-gray-900">
								Description
							</h2>
							<p className="leading-relaxed text-gray-700">{car.description}</p>
						</div>

						{/* Features */}
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<h2 className="mb-4 text-2xl font-bold text-gray-900">
								Features
							</h2>
							<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
								{features.map((feature, idx) => (
									<div
										key={idx}
										className="flex items-center gap-2 text-gray-700"
									>
										<div className="h-2 w-2 rounded-full bg-blue-500"></div>
										<span>{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right Column - Contact */}
					<div className="lg:col-span-1">
						<div className="sticky top-8 rounded-lg bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-xl font-bold text-gray-900">
								Contact Seller
							</h3>

							<div className="mb-6 space-y-3">
								<button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
									<Phone className="h-5 w-5" />
									Call Now
								</button>
								<button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 font-semibold text-gray-900 transition hover:bg-gray-200">
									<Mail className="h-5 w-5" />
									Send Message
								</button>
							</div>

							<div className="space-y-3 border-t pt-4 text-sm text-gray-600">
								<div className="flex justify-between">
									<span>Color</span>
									<span className="font-semibold text-gray-900">
										{car.color}
									</span>
								</div>
								<div className="flex justify-between">
									<span>VIN</span>
									<span className="font-semibold text-gray-900">{car.vin}</span>
								</div>
							</div>

							<div className="mt-6 rounded-lg bg-blue-50 p-4">
								<div className="mb-1 text-sm font-semibold text-blue-900">
									Schedule Test Drive
								</div>
								<div className="text-xs text-blue-700">
									Book a test drive at your convenience
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
