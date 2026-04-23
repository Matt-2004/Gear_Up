import { CarItems } from "@/app/features/car/types/car.types";
import { formatNumber } from "@/app/shared/utils/numberFormatter";
import { Car } from "lucide-react";

interface AppointmentCarSummaryProps {
  car: CarItems;
}

export default function AppointmentCarSummary({
  car,
}: AppointmentCarSummaryProps) {
  return (
    <div className=" sticky top-20 overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="aspect-video bg-gray-900">
        <img
          src={car.carImages[0]?.url}
          alt={`${car.make} ${car.model}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="py-2 px-4">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              car.carStatus === "Available"
                ? "bg-primary-200 text-primary-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {car.carStatus}
          </span>
        </div>
        <h2 className="mb-1 text-xl font-semibold text-gray-900 sm:text-2xl">
          {car.year} {car.make} {car.model}
        </h2>
        <p className="mb-4 text-gray-600 text-xs">{car.title}</p>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-primary text-2xl font-bold sm:text-3xl">
              {formatNumber(car.price)}
            </span>
            <span className="text-gray-500">Baht</span>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Car className="h-4 w-4" />
            <span>
              {car.mileage.toLocaleString()} KM • {car.fuelType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
