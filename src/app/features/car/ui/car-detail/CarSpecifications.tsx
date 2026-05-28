import { Calendar, Cog, Fuel, Gauge } from "lucide-react";
import { CarDetailModel } from "../../types/car.model";

interface CarSpecificationsProps {
  car: CarDetailModel;
}

const specs = (car: CarDetailModel) => [
  {
    icon: Gauge,
    label: "Mileage",
    value: `${car.mileage.toLocaleString()} km`,
  },
  {
    icon: Fuel,
    label: "Fuel",
    value: car.fuel,
  },
  {
    icon: Cog,
    label: "Transmission",
    value: car.transmission,
  },
  {
    icon: Calendar,
    label: "Year",
    value: car.year.toString(),
  },
];

export default function CarSpecifications({ car }: CarSpecificationsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {specs(car).map((spec) => (
        <div
          key={spec.label}
          className="group flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-150 hover:border-white/[0.15] hover:bg-white/[0.06]"
        >
          <div className="flex items-center gap-2">
            <spec.icon className="h-4 w-4 shrink-0 text-primary-300" />
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-200">
              {spec.label}
            </p>
          </div>
          <p className="text-sm font-semibold tracking-wider text-white">
            {spec.value}
          </p>
        </div>
      ))}
    </div>
  );
}
