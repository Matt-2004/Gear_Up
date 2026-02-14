import { CarGrid } from "@/components/Car/CarGrid";
import { getAllCars } from "@/utils/API/CarAPI";
import Link from "next/link";

export default async function HOME() {
  let cars = [];

  try {
    const response = await getAllCars(1);
    cars = response?.data?.items || [];
  } catch (error) {
    console.error("Failed to fetch cars:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="rounded-3xl bg-white border border-gray-100 p-6 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                Thailand&apos;s trusted used car marketplace
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Find your next car with confidence
              </h1>
              <p className="mt-4 text-gray-600 md:text-lg">
                Browse verified listings, compare details, and connect directly
                with sellers in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/car/search"
                  className="rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  Explore Cars
                </Link>
                <Link
                  href="/post/discover"
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Discover Posts
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4">
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    10K+
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Active users
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    2K+
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Cars listed
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    24/7
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Support
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-primary-50 p-5 border border-primary-100">
                <p className="text-sm text-primary-700 font-semibold">
                  Verified Listings
                </p>
                <p className="mt-2 text-gray-700 text-sm">
                  Browse high-quality vehicles with clear details and pricing.
                </p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-5 border border-orange-100">
                <p className="text-sm text-orange-700 font-semibold">
                  Direct Contact
                </p>
                <p className="mt-2 text-gray-700 text-sm">
                  Message dealers and owners directly for quick responses.
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-5 border border-blue-100">
                <p className="text-sm text-blue-700 font-semibold">
                  Smart Search
                </p>
                <p className="mt-2 text-gray-700 text-sm">
                  Filter by make, model, year, mileage, and more.
                </p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5 border border-gray-200">
                <p className="text-sm text-gray-700 font-semibold">
                  Appointment Ready
                </p>
                <p className="mt-2 text-gray-700 text-sm">
                  Schedule test drives and manage appointments with ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CarGrid cars={cars} />

      <section className="container mx-auto px-4 pb-14">
        <div className="rounded-2xl bg-primary-700 p-6 md:p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to sell your car?
            </h2>
            <p className="mt-2 text-primary-100">
              List your vehicle in minutes and reach buyers across the platform.
            </p>
          </div>
          <Link
            href="/profile/dealer/cars/add"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary-700 hover:bg-gray-100 transition-colors"
          >
            Add New Car
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
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
      </footer>
    </main>
  );
}
