"use client";

import { CarItems } from "@/app/types/car.types";
import { formatNumber } from "@/lib/numberFormatter";
import Image from "next/image";
import Link from "next/link";

export function CarCard({ carItem }: { carItem: CarItems }) {
  return (
    <Link href={`/car/${carItem.id}`}>
      <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl shadow-background hover:-translate-y-1 w-full h-[400px]">
        <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
          <Image
            src={carItem?.carImages[0]?.url ?? "/carPlaceholderImage.jpg"}
            fill
            alt={carItem.title || "Car image"}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {carItem.title}
              </h3>
              <p className="flex items-baseline text-sm text-gray-500 mt-1 gap-1">
                <span className="max-w-32 truncate">
                  {carItem.make} {carItem.model}
                </span>
                <span>{carItem.year}</span>
              </p>
            </div>
            {carItem.carStatus === "Available" && (
              <div className="flex-shrink-0">
                <span className="whitespace-nowrap rounded-full bg-primary-100 text-primary-500 px-3 py-1 text-xs font-semibold">
                  For Sale
                </span>
              </div>
            )}
          </div>
          <div className="my-3 h-px w-full bg-gray-200" />
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col items-center justify-center text-gray-600 text-center">
              <CogIcon />
              <span className="text-xs mt-1 line-clamp-1">
                {carItem.transmissionType}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-600 text-center">
              <RoadIcon />
              <span className="text-xs mt-1 line-clamp-1">
                {formatNumber(carItem.mileage)} KM
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-600 text-center">
              <SeatIcon />
              <span className="text-xs mt-1">{carItem.seatingCapacity}</span>
            </div>
          </div>
          <div className="my-3 h-px w-full bg-gray-200" />
          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <div className="shrink-0">
                <p className="text-xs text-gray-500">Price</p>
                <p className="flex items-baseline gap-1">
                  <span className="text-orange-500">฿</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatNumber(carItem.price)}
                  </span>
                </p>
              </div>
              <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm text-white transition-colors hover:bg-orange-600 whitespace-nowrap">
                View Details
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

const CogIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className="shrink-0"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M11 10.27L7 3.34m4 10.39l-4 6.93M12 22v-2m0-18v2m2 8h8m-5 8.66l-1-1.73m1-15.59l-1 1.73M2 12h2m16.66 5l-1.73-1m1.73-9l-1.73 1M3.34 17l1.73-1M3.34 7l1.73 1" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="12" r="8" />
      </g>
    </svg>
  );
};

const RoadIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      className="shrink-0"
    >
      <path
        fill="currentColor"
        d="M5 19V5h1v14zm6.5 0v-3.077h1V19zm6.5 0V5h1v14zm-6.5-5.462v-3.076h1v3.077zm0-5.461V5h1v3.077z"
      ></path>
    </svg>
  );
};

const SeatIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      className="shrink-0"
    >
      <path
        fill="currentColor"
        d="M5.35 5.64c-.9-.64-1.12-1.88-.49-2.79c.64-.9 1.88-1.12 2.79-.49c.9.64 1.12 1.88.49 2.79c-.64.9-1.88 1.12-2.79.49M16 19H8.93c-1.48 0-2.74-1.08-2.96-2.54L4 7H2l2 9.76A4.99 4.99 0 0 0 8.94 21H16m.23-6h-4.88l-1.03-4.1c1.58.89 3.28 1.54 5.15 1.22V10c-1.63.3-3.44-.28-4.69-1.26L9.14 7.47c-.23-.18-.49-.3-.76-.38a2.2 2.2 0 0 0-.99-.06h-.02a2.27 2.27 0 0 0-1.84 2.61l1.35 5.92A2.99 2.99 0 0 0 9.83 18h6.85l3.82 3l1.5-1.5"
      ></path>
    </svg>
  );
};
