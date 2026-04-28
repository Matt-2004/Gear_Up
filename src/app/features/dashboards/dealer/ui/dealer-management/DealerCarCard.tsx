"use client";

import { CarItems } from "@/app/features/car/types/car.types";
import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { getStatusColor } from "@/app/features/dashboards/dealer/utils/getStatusColor";
import { DashboardCarDTO } from "../../types/dashboard-car/dashboard-car.dto";

interface DealerCarCardProps {
  car: DashboardCarDTO;
  onDelete: (carId: string) => void;
  onEdit: (carId: string) => void;
}

export default function DealerCarCard({
  car,
  onDelete,
  onEdit,
}: DealerCarCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className="group relative overflow-hidden "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowOptions(false);
      }}
    >
      <CarCard carItem={{
        id: car.id,
        title: car.title,
        make: car.make,
        model: car.model,
        price: car.price,
        mileage: car.mileage,
        seatingCapacity: car.seatingCapacity,
        carValidationStatus: car.carValidationStatus,
        carImages: car.thumbnailUrl,
        transmissionType: car.transmissionType,
      }} />

      {/* Status Badge */}
      {car.carValidationStatus && (
        <div
          className={`absolute top-3 left-3 z-10  border px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${getStatusColor(
            car.carValidationStatus.charAt(0).toUpperCase() +
              car.carValidationStatus.slice(1),
          )}`}
        >
          {car.carValidationStatus.charAt(0).toUpperCase() +
            car.carValidationStatus.slice(1)}
        </div>
      )}

      {/* Options Icon */}
      <button
        className={`absolute top-3 right-3 z-10  border border-gray-200 bg-white/95 p-2.5 backdrop-blur-md ${
          isHovered ? "opacity-100" : "opacity-0"
        } hover:border-blue-400 hover:bg-gray-50`}
        onClick={() => setShowOptions(!showOptions)}
        onMouseEnter={() => setShowOptions(true)}
        aria-label="Car options"
      >
        <MoreVertical className="h-5 w-5 text-gray-700" />
      </button>

      {/* Options Menu */}
      {showOptions && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute top-16 right-3 z-20 w-52 overflow-hidden  border border-gray-100 bg-white py-2 shadow-sm duration-150">
          <button
            onClick={() => onEdit(car.id)}
            className="group/item flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
          >
            <div className="flex h-8 w-8 items-center justify-center  bg-blue-100 transition-colors group-hover/item:bg-blue-200">
              <Pencil className="h-4 w-4 text-blue-600" />
            </div>
            <span>Edit Vehicle</span>
          </button>
          <div className="mx-2 my-1 h-px bg-gray-200" />
          <button
            onClick={() => onDelete(car.id)}
            className="group/item flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <div className="flex h-8 w-8 items-center justify-center  bg-red-100 transition-colors group-hover/item:bg-red-200">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <span>Delete Vehicle</span>
          </button>
        </div>
      )}
    </div>
  );
}
