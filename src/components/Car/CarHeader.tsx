import { CarItems } from "@/types/car.types";
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
    <div className="mb-0">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${
                car.carStatus === "Available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {car.carStatus}
            </span>
            <span
              className={`rounded-md px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${
                car.carCondition === "New"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {car.carCondition}
            </span>
          </div>
          <h1 className=" text-xl font-semibold text-gray-900 ">
            {car.make} {car.model}
          </h1>
          <p className="text-xs font-medium text-gray-600">
            {car.title} • {car.year}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onToggleFavorite}
            className={`cursor-pointer rounded-full p-2 transition-all hover:bg-gray-50 hover:shadow-sm ${
              isFavorite ? "bg-red-50 text-red-500" : "text-gray-400"
            }`}
          >
            <Heart
              className="h-6 w-6"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-4">
        <span className="text-[32px] font-bold text-primary-700 sm:text-[36px]">
          ฿{formatNumber(car.price)}
        </span>
      </div>
    </div>
  );
}
