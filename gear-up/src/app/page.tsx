import { CarGrid } from "@/components/Car/CarGrid"
import ActionButtons from "@/components/Home/ActionButtons"
import { getAllCars } from "@/utils/API/CarAPI"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "Gear Up - Your Ultimate Car Marketplace",
	description:
		"Discover, buy, and sell amazing vehicles on Gear Up. Find your dream car today!",
}

export default async function HOME() {
	let cars = []

	try {
		const response = await getAllCars(1)
		cars = response?.data?.items || []
	} catch (error) {
		console.error("Failed to fetch cars:", error)
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<section className="flex w-full justify-center pt-10 pb-8 md:pt-16 md:pb-12">
				<div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
					<div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-10">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
							<div>
								<p className="bg-primary-100 text-primary-700 mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold">
									Thailand&apos;s trusted used car marketplace
								</p>
								<h1 className="text-3xl leading-tight font-bold text-gray-900 md:text-5xl">
									Find your next car with confidence
								</h1>
								<p className="mt-4 text-gray-600 md:text-lg">
									Browse verified listings, compare details, and connect
									directly with sellers in one place.
								</p>

								<ActionButtons />

								<div className="mt-8 grid grid-cols-3 gap-3 md:gap-4">
									<div className="rounded-xl bg-gray-50 p-4 text-center">
										<p className="text-xl font-bold text-gray-900 md:text-2xl">
											10K+
										</p>
										<p className="mt-1 text-xs text-gray-600 md:text-sm">
											Active users
										</p>
									</div>
									<div className="rounded-xl bg-gray-50 p-4 text-center">
										<p className="text-xl font-bold text-gray-900 md:text-2xl">
											2K+
										</p>
										<p className="mt-1 text-xs text-gray-600 md:text-sm">
											Cars listed
										</p>
									</div>
									<div className="rounded-xl bg-gray-50 p-4 text-center">
										<p className="text-xl font-bold text-gray-900 md:text-2xl">
											24/7
										</p>
										<p className="mt-1 text-xs text-gray-600 md:text-sm">
											Support
										</p>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="bg-primary-50 border-primary-100 rounded-2xl border p-5">
									<p className="text-primary-700 text-sm font-semibold">
										Verified Listings
									</p>
									<p className="mt-2 text-sm text-gray-700">
										Browse high-quality vehicles with clear details and pricing.
									</p>
								</div>
								<div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
									<p className="text-sm font-semibold text-orange-700">
										Direct Contact
									</p>
									<p className="mt-2 text-sm text-gray-700">
										Message dealers and owners directly for quick responses.
									</p>
								</div>
								<div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
									<p className="text-sm font-semibold text-blue-700">
										Smart Search
									</p>
									<p className="mt-2 text-sm text-gray-700">
										Filter by make, model, year, mileage, and more.
									</p>
								</div>
								<div className="rounded-2xl border border-gray-200 bg-gray-100 p-5">
									<p className="text-sm font-semibold text-gray-700">
										Appointment Ready
									</p>
									<p className="mt-2 text-sm text-gray-700">
										Schedule test drives and manage appointments with ease.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<CarGrid cars={cars} />

			<section className="flex w-full justify-center pb-14">
				<div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
					<div className="bg-primary-700 flex flex-col gap-5 rounded-2xl p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
						<div>
							<h2 className="text-2xl font-bold md:text-3xl">
								List your vehicle today
							</h2>
							<p className="text-primary-100 mt-2">
								Reach thousands of potential buyers and sell faster with our
								platform.
							</p>
						</div>
						<Link
							href="/profile/dealer/register?step=1"
							className="text-primary-700 inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold transition-colors hover:bg-gray-100"
						>
							<Plus className="mr-1 h-4 w-4" />
							Add New Car
						</Link>
					</div>
				</div>
			</section>

			<footer className="border-t border-gray-200 bg-white">
				<div className="flex w-full justify-center py-8">
					<div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
						<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<p className="text-sm font-semibold text-gray-900">Gear Up</p>
							<div className="flex flex-wrap gap-4 text-sm text-gray-600">
								<span>About</span>
								<span>Contact</span>
								<span>Privacy</span>
								<span>Terms</span>
							</div>
						</div>
						<p className="mt-4 text-xs text-gray-500">
							© 2026 Gear Up. This is a placeholder footer.
						</p>
					</div>
				</div>
			</footer>
		</main>
	)
}
