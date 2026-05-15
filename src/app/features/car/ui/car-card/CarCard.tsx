"use client";

import { formatNumber } from "@/app/shared/utils/numberFormatter";
import CarImage from "@/app/shared/ui/Image";
import { CarModel } from "../../types/car.model";
import { useRouter } from "next/navigation";
import { Gauge, Cog, Users, BadgeCheck } from "lucide-react";

export function CarCard({ carItem }: { carItem: CarModel }) {
  const router = useRouter();

  const isVerified = carItem.status?.toLowerCase() === "approved";
  const transmissionLabel =
    carItem.transmission === "Automatic"
      ? "Auto"
      : carItem.transmission === "SemiAutomatic"
        ? "Hybrid"
        : carItem.transmission && carItem.transmission !== "Default"
          ? carItem.transmission
          : "Auto";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50"
      data-testid="car-card"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <CarImage
          src={carItem.imageUrl}
          alt={carItem.title || "Car image"}
          width={600}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent)]" />

        {/* Top badges row */}
        <div className="absolute inset-x-0 top-0 flex items-center p-3">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary-700 backdrop-blur-sm">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          ) : null}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title and Price */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="line-clamp-1 text-base font-bold text-gray-900"
              data-testid="car-title"
            >
              {carItem.title}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {carItem.make} {carItem.model}
            </p>
          </div>
          <p
            className="shrink-0 text-lg font-bold text-primary"
            data-testid="car-price"
          >
            {carItem.price && carItem.price > 0
              ? `฿${formatNumber(carItem.price)}`
              : "Contact"}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          <SpecBadge icon={Cog} label="Trans" value={transmissionLabel} />
          <SpecBadge icon={Gauge} label="Mileage" value={formatNumber(carItem.mileage ?? 0)} />
          <SpecBadge icon={Users} label="Seats" value={`${carItem.seats}`} />
        </div>

        {/* View Details Button */}
        <button
          onClick={() => router.push(`/car/${carItem.id}`)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
          data-testid="view-details"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

function SpecBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 px-2 py-1.5">
      <Icon className="mb-0.5 h-3 w-3 text-gray-400" />
      <span className="text-[10px] font-medium text-gray-500">{label}</span>
      <span className="text-[11px] font-semibold text-gray-800">{value}</span>
    </div>
  );
}
