"use client";

import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { getAllCars } from "@/app/shared/utils/API/CarAPI";
import { carMapper } from "@/app/features/car/types/car.mapper";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface MoreCarOptionsProps {
  currentCarId: string;
}

export default function MoreCarOptions({ currentCarId }: MoreCarOptionsProps) {
  const { data } = useQuery({
    queryKey: ["more-car-options"],
    queryFn: async () => {
      const res = await getAllCars(null);
      return res.data.items.map(carMapper);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const related = useMemo(
    () => (data ?? []).filter((car) => car.id !== currentCarId).slice(0, 4),
    [data, currentCarId],
  );

  if (related.length === 0) return null;

  return (
    <section className="relative z-10 border-t border-white/5 py-16 md:py-20">
      <div className="mx-auto w-full px-4 lg:w-[90%] xl:w-[75%]">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-300">
              More Options
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">
              You Might Also Like
            </h2>
            <p className="mt-2 text-sm text-zinc-200">More cars worth a look</p>
          </div>
          <Link
            href="/car/search"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-300 transition-colors hover:text-white sm:inline-flex"
          >
            Browse All Cars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Car Card Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {related.map((car) => (
            <CarCard key={car.id} carItem={car} />
          ))}
        </div>

        {/* Mobile "View All" link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/car/search"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
          >
            Browse All Cars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
