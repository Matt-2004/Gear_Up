import { CarItems } from "@/app/types/car.types";
import { formatNumber } from "@/lib/numberFormatter";
import { Heart } from "lucide-react";

interface CarHeaderProps {
  car: CarItems;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CarHeader({
  car,
  isFavorite,
  onToggleFavorite,
}: CarHeaderProps) {
  return (
    <div className="mb-6 rounded-xl bg-white p-6  border border-gray-100">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${car.carStatus === "Available"
                ? "bg-primary-200 text-primary-800"
                : "bg-red-100 text-red-800"
                }`}
            >
              {car.carStatus}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${car.carCondition === "New"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {car.carCondition}
            </span>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {car.year} {car.make} {car.model}
          </h1>
          <p className="text-lg text-gray-600 font-medium">{car.title}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onToggleFavorite}
            className={`rounded-full cursor-pointer p-3 transition-all hover:shadow-sm ${isFavorite
              ? "bg-red-50 text-red-500"
              : ""
              }`}
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold text-orange-500">
          ฿{formatNumber(car.price)}
        </span>
        <span className="text-gray-500 text-lg">Baht</span>
      </div>
    </div>
  );
}
