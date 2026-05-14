"use client";

import { formatNumber } from "@/app/shared/utils/numberFormatter";
import CarImage from "@/app/shared/ui/Image";
import { CarModel } from "../../types/car.model";
import { useRouter } from "next/navigation";

export function CarCard({
  carItem,

  priority = true,
}: {
  carItem: CarModel;
  className?: string;
  priority?: boolean;
}) {
  const router = useRouter();
  console.log("carItem Id:", carItem.id);
  return (
    <article
      className="group mx-auto flex w-85 max-w-full flex-col overflow-hidden rounded-md bg-white shadow-sm shadow-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
      data-testid="car-card"
    >
      <div className="relative w-full shrink-0 overflow-hidden aspect-16/10 sm:aspect-video">
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <CarImage
          src={carItem.imageUrl}
          alt={carItem.title || "Car image"}
          width={600}
          height={600}
          className="object-cover transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 gap-y-2">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors"
              data-testid="car-title"
            >
              {carItem.title}
            </h3>
            <p className="flex items-baseline gap-1 text-sm text-gray-700">
              <span className="max-w-32 truncate">
                {carItem.make} {carItem.model}
              </span>
            </p>
          </div>
          <h3
            className="font-semibold text-primary text-xl"
            data-testid="car-price"
          >
            {carItem.price && carItem.price > 0
              ? `฿${formatNumber(carItem.price)}`
              : "Contact for Price"}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          {/* Spacs Info */}
          <SpacsInfoItem
            spacFeature="Tran"
            spacValue={
              carItem.transmission && carItem.transmission === "Automatic"
                ? "Auto"
                : carItem.transmission &&
                    carItem.transmission === "SemiAutomatic"
                  ? "Hybrid"
                  : carItem.transmission && carItem.transmission !== "Default"
                    ? carItem.transmission
                    : "Auto"
            }
          />
          <SpacsInfoItem
            spacFeature="Miles"
            spacValue={formatNumber(carItem.mileage ?? 0)}
          />
          <SpacsInfoItem
            spacFeature="Seats"
            spacValue={`${carItem.seats} seats`}
          />
        </div>
        <button
          onClick={() => router.push(`/car/${carItem.id}`)}
          className="mt-4 w-full rounded-lg bg-white text-primary hover:text-white cursor-pointer py-2 border border-primary font-semibold hover:bg-primary"
          data-testid="view-details"
        >
          View Details
        </button>
      </div>
    </article>
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
    <div className="rounded-xl bg-black/5 px-3 py-2 flex flex-col items-center gap-1">
      <h3 className="text-xs font-semibold text-gray-700">
        {spacFeature.toUpperCase()}
      </h3>
      <p className="text-xs text-primary">{spacValue}</p>
    </div>
  );
};
