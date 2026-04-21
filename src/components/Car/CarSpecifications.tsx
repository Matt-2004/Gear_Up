import { CarItems } from "@/types/car.types";
import { Calendar, Cog, Fuel, Gauge } from "lucide-react";

interface CarSpecificationsProps {
  car: CarItems;
}

export default function CarSpecifications({ car }: CarSpecificationsProps) {
  const specs = [
    {
      icon: Gauge,
      label: "Mileage",
      value: `${car.mileage.toLocaleString()} KM`,
    },
    {
      icon: Fuel,
      label: "Fuel",
      value: car.fuelType,
    },
    {
      icon: Cog,
      label: "Transmission",
      value: car.transmissionType,
    },
    {
      icon: Calendar,
      label: "Year",
      value: car.year.toString(),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex flex-col items-center py-4 rounded-lg bg-[#FAF8FF] px-4"
          >
            <div className="flex items-center gap-2 mb-1 ">
              <spec.icon className="h-5 w-5 text-primary-600" />
              <div className="text-sm font-medium text-gray-500">
                {spec.label}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
