"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { CarCard } from "./CarCard";
import { getAllCars } from "@/app/shared/utils/API/CarAPI";
import { carMapper } from "../../types/car.mapper";

export function CarGrid() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["featured-cars"],
    queryFn: async () => {
      const res = await getAllCars(null);
      return res.data.items.map(carMapper);
    },
    staleTime: 5 * 60 * 1000,
  });

  const cars = data ?? [];
  const featuredCars = cars
    .filter((car) => car.status?.toLowerCase() === "approved")
    .slice(0, 4);

  return (
    <section className="flex w-full justify-center py-8 bg-[#F2F3FF]" data-testid="featured-cars">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Featured Cars
          </h2>
          <p className="text-sm text-gray-700">
            Discover our latest collection of quality vehicles
          </p>
        </div>

        {isLoading && (
          <div className="flex min-h-100 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Loading featured cars...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-700">Failed to load cars</p>
              <p className="mt-2 text-sm text-gray-600">
                Something went wrong while fetching listings.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && featuredCars.length === 0 && (
          <div className="flex min-h-100 items-center justify-center" data-testid="no-cars">
            <div className="text-center">
              <p className="text-xl text-gray-700">No cars available</p>
              <p className="mt-2 text-sm text-gray-600">
                Check back later for new listings
              </p>
            </div>
          </div>
        )}

        {featuredCars.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4 md:gap-6">
            {featuredCars.map((car, index) => (
              <CarCard key={car.id} carItem={car} priority={index === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
