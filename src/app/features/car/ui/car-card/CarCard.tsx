"use client";

import { CarItems } from "@/app/features/car/types/car.types";
import { formatNumber } from "@/app/shared/utils/numberFormatter";
import Link from "next/link";
import CarImage from "@/app/shared/ui/Image";

export function CarCard({
  carItem,
  className = "",
  priority = true,
}: {
  carItem: CarItems;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href={`/car/${carItem.id}`} className={`block ${className}`.trim()}>
      <article className="group mx-auto flex w-[340px] max-w-full flex-col overflow-hidden rounded-md bg-white shadow-sm shadow-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
        <div className="relative w-full shrink-0 overflow-hidden aspect-16/10 sm:aspect-video">
          <CarImage
            src={carItem?.carImages[0]?.url}
            alt={carItem.title || "Car image"}
            width={600}
            height={600}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors">
                {carItem.title}
              </h3>
              <p className="flex items-baseline gap-1 text-xs text-gray-500">
                <span className="max-w-32 truncate">
                  {carItem.make} {carItem.model}
                </span>
                <span>{carItem.year}</span>
              </p>
            </div>
            <h3 className="font-semibold text-primary text-xl">
              {carItem.price > 0
                ? `฿${formatNumber(carItem.price)}`
                : "Contact for Price"}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            {/* Spacs Info */}
            <SpacsInfoItem
              spacFeature="Tran"
              spacValue={
                carItem.transmissionType === "Automatic"
                  ? "Auto"
                  : carItem.transmissionType === "SemiAutomatic"
                    ? "Hybrid"
                    : carItem.transmissionType
              }
            />
            <SpacsInfoItem
              spacFeature="Miles"
              spacValue={formatNumber(carItem.mileage)}
            />
            <SpacsInfoItem
              spacFeature="Seats"
              spacValue={`${carItem.seatingCapacity} seats`}
            />
          </div>
          <button className="mt-4 w-full rounded-lg bg-white text-primary hover:text-white cursor-pointer py-2 border border-primary font-semibold hover:bg-primary">
            View Details
          </button>
        </div>
      </article>
    </Link>
  );
}

const SpacsInfoItem = ({
  spacFeature,
  spacValue,
}: {
  spacFeature: string;
  spacValue: string;
}) => {
  return (
    <div className="bg-[#FAF8FF] rounded-lg p-2 flex flex-col items-center gap-1">
      <h3 className="text-xs font-semibold text-gray-400">
        {spacFeature.toUpperCase()}
      </h3>
      <p className="text-xs text-primary">{spacValue}</p>
    </div>
  );
};
