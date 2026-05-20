"use client";

import { useQuery } from "@tanstack/react-query";
import { CarCard } from "./CarCard";
import { getAllCars } from "@/app/shared/utils/API/CarAPI";
import { carMapper } from "../../types/car.mapper";
import { SkeletonCard } from "@/app/shared/ui/Skeleton";
import SectionErrorBoundary from "@/app/shared/ui/SectionErrorBoundary";
import SectionErrorFallback from "@/app/shared/ui/SectionErrorFallback";
import EmptyState from "@/app/shared/ui/EmptyState";
import StaleDataBanner from "@/app/shared/ui/StaleDataBanner";
import { Car } from "lucide-react";

export function CarGrid() {
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
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

  const hasStaleData = isError && featuredCars.length > 0;

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

        {/* Stale data banner */}
        {hasStaleData && (
          <div className="mb-6">
            <StaleDataBanner
              onRefresh={() => refetch()}
              isRefreshing={isRefetching}
            />
          </div>
        )}

        <SectionErrorBoundary>
          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error (no stale data to fall back on) */}
          {isError && !hasStaleData && (
            <SectionErrorFallback
              onRetry={() => refetch()}
              isRetrying={isRefetching}
            />
          )}

          {/* Empty */}
          {!isLoading && !isError && featuredCars.length === 0 && (
            <EmptyState
              icon={<Car className="h-6 w-6" />}
              title="No cars available"
              description="Check back later for new listings."
              data-testid="no-cars"
            />
          )}

          {/* Results (or stale results during error) */}
          {!isLoading && featuredCars.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredCars.map((car) => (
                <CarCard key={car.id} carItem={car} />
              ))}
            </div>
          )}
        </SectionErrorBoundary>
      </div>
    </section>
  );
}
