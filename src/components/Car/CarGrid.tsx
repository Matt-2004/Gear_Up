"use client";

import { CarItems } from "@/types/car.types";
import { CarCard } from "./CarCard";

export function CarGrid({ cars }: { cars: CarItems[] }) {
  return (
    <section className="flex w-full justify-center py-8 bg-[#F2F3FF]">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
          <p className=" text-gray-500 text-base">
            Discover our latest collection of quality vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-6">
          {cars.slice(0, 3).map((car, index) => (
            <CarCard key={car.id} carItem={car} priority={index === 0} />
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
      </div>
    </section>
  );
}
