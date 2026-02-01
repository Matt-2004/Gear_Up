import { CarItems } from "@/app/types/car.types";
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
      label: "Fuel Type",
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
    <div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
        <div className="h-1 w-10 bg-primary-500 rounded"></div>
        Key Specifications
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-xl  p-5 transition-all hover:shadow-md hover:scale-105"
          >
            <spec.icon className="mb-2 h-8 w-8 text-primary-600" />
            <div className="text-sm text-gray-600 font-medium">
              {spec.label}
            </div>
            <div className="font-bold text-gray-900">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
