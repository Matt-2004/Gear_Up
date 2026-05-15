"use client";

import { useQuery } from "@tanstack/react-query";
import { CarCard } from "./CarCard";
import { getAllCars } from "@/app/shared/utils/API/CarAPI";
import { carMapper } from "../../types/car.mapper";
import { SkeletonCard } from "@/app/shared/ui/Skeleton";

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
    <section
      className="flex w-full justify-center bg-gray-50 py-16 md:py-20"
      data-testid="featured-cars"
    >
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold tracking-wide text-primary-700">
            Featured Vehicles
          </span>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Handpicked for You
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Discover our latest collection of quality vehicles, verified and
            ready for you.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-700">Failed to load cars</p>
              <p className="mt-2 text-sm text-gray-500">
                Something went wrong while fetching listings.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && featuredCars.length === 0 && (
          <div
            className="flex min-h-80 items-center justify-center"
            data-testid="no-cars"
          >
            <div className="text-center">
              <p className="text-xl text-gray-700">No cars available</p>
              <p className="mt-2 text-sm text-gray-500">
                Check back later for new listings
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && featuredCars.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredCars.map((car) => (
              <CarCard key={car.id} carItem={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
