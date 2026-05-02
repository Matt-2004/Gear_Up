"use client";

import { CarItems } from "@/app/features/car/types/car.types";
import { CarCard } from "./CarCard";
import { CarModel } from "../../types/car.model";

export function CarGrid({ cars = [] }: { cars?: CarModel[] }) {
  const featuredCars = cars
    .filter((car) => car.status?.toLowerCase() === "approved")
    .slice(0, 3);

  return (
    <section className="flex w-full justify-center py-8 bg-[#F2F3FF]">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Cars</h2>
          <p className="text-base text-gray-700">
            Discover our latest collection of quality vehicles
          </p>
        </div>
        {featuredCars.length === 0 && (
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-700">No cars available</p>
              <p className="mt-2 text-sm text-gray-600">
                Check back later for new listings
              </p>
            </div>
          </div>
        )}

        {featuredCars.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-6">
            {featuredCars.map((car, index) => (
              <CarCard key={car.id} carItem={car} priority={index === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
