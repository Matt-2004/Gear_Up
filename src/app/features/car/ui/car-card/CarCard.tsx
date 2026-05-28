"use client";

import { formatNumber } from "@/app/shared/utils/numberFormatter";
import CarImage from "@/app/shared/ui/Image";
import { CarModel } from "../../types/car.model";
import { useRouter } from "next/navigation";
import { Gauge, Cog, BadgeCheck, MapPin, Fuel } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { getVehicleDetail } from "@/data/vehicleDetails";

export function CarCard({ carItem }: { carItem: CarModel }) {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);
  const details = useMemo(() => getVehicleDetail(carItem.title), [carItem.title]);
  const isVerified = carItem.status?.toLowerCase() === "approved";
  const transmissionLabel =
    carItem.transmission === "Automatic"
      ? "Auto"
      : carItem.transmission === "SemiAutomatic"
        ? "Hybrid"
        : carItem.transmission && carItem.transmission !== "Default"
          ? carItem.transmission
          : "Auto";

  const handleClick = useCallback(() => {
    router.push(`/car/${carItem.id}`);
  }, [router, carItem.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      onClick={handleClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
      data-testid="car-card"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <CarImage
          src={carItem.imageUrl}
          alt={carItem.title || "Car image"}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setImgLoaded(true)}
        />

      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title + Price row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm font-bold leading-snug text-gray-900 line-clamp-2 min-h-10"
              data-testid="car-title"
            >
              {carItem.title}
            </h3>
            <div className="mt-1 flex h-5 items-center gap-1.5">
              <p className="text-xs text-gray-500 truncate">
                {carItem.make} {carItem.model}
              </p>
              {isVerified && (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
          <p
            className="shrink-0 text-base font-bold leading-tight text-primary-700 text-right tabular-nums"
            data-testid="car-price"
          >
            {carItem.price && carItem.price > 0
              ? `฿${formatNumber(carItem.price)}`
              : "Contact"}
          </p>
        </div>

        {/* Specs grid */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <Gauge className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-600">
              {formatNumber(carItem.mileage ?? 0)} km
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <Cog className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-600">
              {transmissionLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <Fuel className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-600">{details.fuel}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="text-[11px] font-medium text-gray-600 truncate">{details.location}</span>
          </div>
        </div>

        <button
          type="button"
          data-testid="view-details"
          onClick={(event) => {
            event.stopPropagation();
            handleClick();
          }}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-primary-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700 transition-colors hover:bg-primary-50"
        >
          View Details
        </button>
      </div>
    </motion.article>
  );
}
