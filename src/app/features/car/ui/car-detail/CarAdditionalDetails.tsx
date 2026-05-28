import { Info, Gauge, CarFront, FileText } from "lucide-react";
import { CarDetailModel } from "../../types/car.model";

interface CarAdditionalDetailsProps {
  car: CarDetailModel;
}

const categories = (car: CarDetailModel) => [
  {
    title: "Overview",
    icon: Info,
    details: [
      { label: "Make", value: car.make },
      { label: "Model", value: car.model },
      { label: "Year", value: car.year },
      { label: "Condition", value: car.condition },
    ],
  },
  {
    title: "Performance & Engine",
    icon: Gauge,
    details: [
      { label: "Engine", value: `${car.engine}L` },
      { label: "Transmission", value: car.transmission },
      { label: "Fuel Type", value: car.fuel },
      { label: "Mileage", value: `${car.mileage.toLocaleString()} km` },
    ],
  },
  {
    title: "Exterior & Interior",
    icon: CarFront,
    details: [
      { label: "Color", value: car.color },
      { label: "Seats", value: `${car.seats} Seats` },
    ],
  },
  {
    title: "Registration",
    icon: FileText,
    details: [
      { label: "VIN", value: car.vin },
      { label: "License Plate", value: car.license },
    ],
  },
];

export default function CarAdditionalDetails({
  car,
}: CarAdditionalDetailsProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {categories(car).map((category) => (
        <div key={category.title}>
          <div className="mb-4 flex items-center gap-2.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
              <category.icon className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              {category.title}
            </h4>
          </div>
          <div className="space-y-0">
            {category.details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-b-0"
              >
                <span className="text-sm text-zinc-200">{detail.label}</span>
                <span className="text-sm font-semibold text-white">
                  {detail.value || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
