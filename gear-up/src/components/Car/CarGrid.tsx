import { CarItems } from "@/app/types/car.types"
import { CarCard } from "./CarCard"

export function CarGrid({ cars }: { cars: CarItems[] }) {
    return (
        <section className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
                <p className="mt-2 text-gray-600">
                    Discover our latest collection of quality vehicles
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {cars.slice(0, 10).map((car) => (
                    <CarCard key={car.id} carItem={car} />
                ))}
            </div>

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
        </section>
    )
}
