"use client";

import { CarItems } from "@/app/types/car.types";
import { CarCard } from "@/components/Car/CarCard";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { getStatusColor } from "../utils";

interface DealerCarCardProps {
  car: CarItems;
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
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowOptions(false);
      }}
    >
      <CarCard carItem={car} />

      {/* Status Badge */}
      {car.carValidationStatus && (
        <div
          className={`absolute top-3 left-3 z-10 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${getStatusColor(
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
        className={`absolute top-3 right-3 z-10 rounded-lg bg-white/95 backdrop-blur-sm p-2 shadow-lg border border-gray-200 transition-all ${
          isHovered ? "opacity-100" : "opacity-0"
        } hover:bg-gray-50`}
        onClick={() => setShowOptions(!showOptions)}
        onMouseEnter={() => setShowOptions(true)}
      >
        <MoreVertical className="h-5 w-5 text-gray-700" />
      </button>

      {/* Options Menu */}
      {showOptions && (
        <div className="absolute top-14 right-3 z-20 w-48 rounded-lg bg-white shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => onEdit(car.id)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Edit Vehicle</span>
          </button>
          <div className="h-px bg-gray-200 my-1" />
          <button
            onClick={() => onDelete(car.id)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span className="font-medium">Delete Vehicle</span>
          </button>
        </div>
      )}
    </div>
  );
}
