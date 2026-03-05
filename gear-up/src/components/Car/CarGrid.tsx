"use client"

import { CarItems } from "@/types/car.types"
import { useState } from "react"
import { CarCard } from "./CarCard"

export function CarGrid({ cars }: { cars: CarItems[] }) {
	const [showAll, setShowAll] = useState(false)

	return (
		<section className="flex w-full justify-center py-8">
			<div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
				<div className="mb-8">
					<h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
					<p className="mt-2 text-gray-600">
						Discover our latest collection of quality vehicles
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-2 xl:grid-cols-5 2xl:grid-cols-5">
					{cars.map((car, index) => (
						<CarCard
							key={car.id}
							carItem={car}
							className={`md:nth-4:hidden lg:nth-10:hidden lg:nth-9:hidden ${!showAll && index >= 4 ? "hidden lg:block" : ""} ${!showAll && index >= 10 ? "lg:hidden" : ""} `}
						/>
					))}
				</div>

				{/* Show More link - only visible on mobile when there are more than 4 cars */}
				{cars.length > 4 && !showAll && (
					<div className="mt-6 flex justify-center lg:hidden">
						<button
							onClick={() => setShowAll(true)}
							className="group hover:text-primary-600 flex cursor-pointer items-center gap-2 text-gray-600 transition-colors"
						>
							<span className="text-sm font-medium">Show more cars</span>
							<svg
								className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>
				)}

				{/* Show Less link - only visible on mobile when expanded */}
				{showAll && (
					<div className="mt-6 flex justify-center lg:hidden">
						<button
							onClick={() => setShowAll(false)}
							className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
						>
							<span className="text-sm font-medium">Show less</span>
							<svg
								className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 15l7-7 7 7"
								/>
							</svg>
						</button>
					</div>
				)}

				{cars.length === 0 && (
					<div className="flex min-h-100 items-center justify-center">
						<div className="text-center">
							<p className="text-xl text-gray-500">No cars available</p>
							<p className="mt-2 text-sm text-gray-400">
								Check back later for new listings
							</p>
						</div>
					</div>
				)}
			</div>
		</section>
	)
}
