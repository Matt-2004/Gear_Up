"use client";

import { useQuery } from "@tanstack/react-query";
import { CarCard } from "./CarCard";
import { getAllCars } from "@/app/shared/utils/API/CarAPI";
import { carMapper } from "../../types/car.mapper";
import { SkeletonCard } from "@/app/shared/ui/Skeleton";
import SectionErrorBoundary from "@/app/shared/ui/SectionErrorBoundary";
import EmptyState from "@/app/shared/ui/EmptyState";
import { Car } from "lucide-react";
import mockVehicles, { toCarModel } from "@/data/mockVehicles";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const FALLBACK_CARS = mockVehicles.slice(0, 8).map(toCarModel);

export function CarGrid() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["featured-cars"],
    queryFn: async () => {
      const res = await getAllCars(null);
      return res.data.items.map(carMapper);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Silently log errors — never show error UI to the user
  useEffect(() => {
    if (isError && error) {
      console.log("[CarGrid] API unavailable, falling back to demo data:", (error as Error).message);
    }
  }, [isError, error]);

  const cars = data ?? [];
  const featuredCars = cars
    .filter((car) => car.status?.toLowerCase() === "approved")
    .slice(0, 8);

  const [showAll, setShowAll] = useState(false);

  // If API returns data, use it. Otherwise (error or empty), use fallback.
  const allCars = featuredCars.length > 0 ? featuredCars : FALLBACK_CARS;
  const displayCars = showAll ? allCars : allCars.slice(0, 4);
  const hasMore = allCars.length > 4;
  const isUsingFallback = featuredCars.length === 0;

  return (
    <section
      className="relative flex w-full justify-center overflow-hidden py-20 md:py-28 min-h-screen"
      style={{ background: "linear-gradient(180deg, #000000 0%, #0a0f05 15%)" }}
      data-testid="featured-cars"
    >
      {/* Green gradient accents */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-600/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-600/[0.03] blur-3xl" />

      <div className="relative z-10 w-full px-4 lg:w-[90%] xl:w-[75%]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.15 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Handpicked for You
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            Discover our latest collection of quality vehicles, verified and ready
            for you.
          </p>
        </motion.div>

        {/* Fallback indicator */}
        {isUsingFallback && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center text-xs text-zinc-500"
          >
            Showing demo listings — real inventory is on the way.
          </motion.p>
        )}

        <SectionErrorBoundary>
          {/* Loading — skeleton grid */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty (only if not loading and truly no data at all) */}
          {!isLoading && displayCars.length === 0 && (
            <EmptyState
              icon={<Car className="h-6 w-6" />}
              title="No cars available"
              description="Check back later for new listings."
              data-testid="no-cars"
            />
          )}

          {/* Results / Fallback */}
          {!isLoading && displayCars.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayCars.map((car) => (
                  <CarCard key={car.id} carItem={car} />
                ))}
              </div>

              {/* See More */}
              {hasMore && !showAll && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-10 flex justify-center"
                >
                  <button
                    onClick={() => setShowAll(true)}
                    className="flex flex-col items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                  >
                    <span>See More Vehicles</span>
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </button>
                </motion.div>
              )}

              {showAll && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-10 flex justify-center"
                >
                  <button
                    onClick={() => setShowAll(false)}
                    className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    Show Less
                  </button>
                </motion.div>
              )}
            </>
          )}
        </SectionErrorBoundary>
      </div>
    </section>
  );
}
