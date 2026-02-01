import { CarItems } from "@/app/types/car.types";

interface CarAdditionalDetailsProps {
  car: CarItems;
}

export default function CarAdditionalDetails({
  car,
}: CarAdditionalDetailsProps) {
  const details = [
    { label: "Engine Capacity", value: `${car.engineCapacity}L` },
    { label: "Seating Capacity", value: `${car.seatingCapacity} Seats` },
    { label: "Color", value: car.color },
    { label: "License Plate", value: car.licensePlate },
    { label: "VIN", value: car.vin, fullWidth: true, mono: true },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
        <div className="h-1 w-10 bg-primary-500 rounded"></div>
        Additional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-100 ${
              detail.fullWidth ? "md:col-span-2" : ""
            }`}
          >
            <span className="text-gray-700 font-medium">{detail.label}</span>
            <span
              className={`font-bold text-primary-700 ${
                detail.mono ? "font-mono" : ""
              }`}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
