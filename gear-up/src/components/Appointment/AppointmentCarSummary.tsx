import { CarItems } from "@/app/types/car.types";
import { formatNumber } from "@/lib/numberFormatter";
import { Car } from "lucide-react";

interface AppointmentCarSummaryProps {
  car: CarItems;
}

export default function AppointmentCarSummary({
  car,
}: AppointmentCarSummaryProps) {
  return (
    <div className="sticky top-8 bg-white rounded-xl shadow-lg border border-primary-100 overflow-hidden">
      <div className="aspect-video bg-gray-900">
        <img
          src={car.carImages[0]?.url}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              car.carStatus === "Available"
                ? "bg-primary-200 text-primary-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {car.carStatus}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {car.year} {car.make} {car.model}
        </h2>
        <p className="text-gray-600 mb-4">{car.title}</p>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-primary-600">
              ${formatNumber(car.price)}
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
