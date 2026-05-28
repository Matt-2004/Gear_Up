"use client";

import { formatNumber } from "@/app/shared/utils/numberFormatter";
import CarImage from "@/app/shared/ui/Image";
import { CarModel } from "../../types/car.model";
import { useRouter } from "next/navigation";
import { Gauge, Cog, Fuel, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { mockCarDetails } from "@/app/shared/mock/mockCarDetails";

export function CarCard({ carItem }: { carItem: CarModel }) {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);
  const details = mockCarDetails[carItem.id];

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
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={handleClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(ellipse_at_center,rgba(196,231,175,0.10)_0%,rgba(196,231,175,0.03)_100%)] backdrop-blur-sm transition-all duration-150 hover:-translate-y-1.5 hover:border-white/[0.15] hover:bg-[radial-gradient(ellipse_at_center,rgba(196,231,175,0.14)_0%,rgba(196,231,175,0.05)_100%)]"
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
      {/* Image — taller cinematic ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
        )}
        <CarImage
          src={carItem.imageUrl}
          alt={carItem.title || "Car image"}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-150 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />
        {/* Subtle gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-150 group-hover:opacity-100" />

        {/* Condition badge */}
        {details?.condition && (
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-200 backdrop-blur-sm">
            {details.condition}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Make + Model */}
        <p className="text-xs font-medium tracking-wide text-zinc-200 uppercase">
          {carItem.make} {carItem.model}
        </p>

        {/* Title */}
        <h3
          className="mt-1 text-sm font-semibold leading-snug text-white line-clamp-2"
          data-testid="car-title"
        >
          {carItem.title}
        </h3>

        {/* Specs — 3 key items */}
        <div className="mt-4 flex items-center gap-3 text-[11px] font-medium text-zinc-200">
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3 w-3 text-zinc-500" />
            {formatNumber(carItem.mileage ?? 0)} km
          </span>
          <span className="text-white/[0.15]">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Cog className="h-3 w-3 text-zinc-500" />
            {transmissionLabel}
          </span>
          <span className="text-white/[0.15]">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-3 w-3 text-zinc-500" />
            {details?.fuel ?? "Petrol"}
          </span>
        </div>

        {/* Price + CTA row */}
        <div className="mt-4 flex items-end justify-between border-t border-white/[0.08] pt-4">
          <p
            className="text-lg font-bold text-primary-200 tabular-nums"
            data-testid="car-price"
          >
            ฿{formatNumber(carItem.price)}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-300 transition-colors group-hover:text-primary-200">
            Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
