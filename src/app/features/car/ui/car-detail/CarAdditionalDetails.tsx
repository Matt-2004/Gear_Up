import { Info, Gauge, CarFront, FileText } from "lucide-react";
import { CarDetailModel } from "../../types/car.model";

interface CarAdditionalDetailsProps {
  car: CarDetailModel;
}

export default function CarAdditionalDetails({
  car,
}: CarAdditionalDetailsProps) {
  const specCategories = [
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
        { label: "Engine Capacity", value: `${car.engine}L` },
        { label: "Transmission", value: car.transmission },
        { label: "Fuel Type", value: car.fuel },
        { label: "Mileage", value: `${car.mileage.toLocaleString()} KM` },
      ],
    },
    {
      title: "Exterior & Interior",
      icon: CarFront,
      details: [
        { label: "Exterior Color", value: car.color },
        { label: "Seating Capacity", value: `${car.seats} Seats` },
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

  return (
    <div className="space-y-8">
      {specCategories.map((category, catIdx) => (
        <div key={catIdx}>
          <div className="flex items-center gap-2 mb-4 border-b-2 border-gray-200  pb-2">
            <category.icon className="h-5 w-5 text-gray-500" />
            <h4 className="text-[18px] font-bold text-primary">
              {category.title}
            </h4>
          </div>
          <div className=" px-8">
            {category.details.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-gray-200 py-2 "
              >
                <span className="font-medium text-gray-500 text-[15px]">
                  {detail.label}
                </span>
                <span className="font-semibold text-gray-900 text-[16px] text-right">
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
