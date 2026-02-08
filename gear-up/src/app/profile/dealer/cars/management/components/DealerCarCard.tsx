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
      className="relative group rounded-xl overflow-hidden"
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
          className={`absolute top-3 left-3 z-10 rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${getStatusColor(
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
        className={`absolute top-3 right-3 z-10 rounded-xl bg-white/95 backdrop-blur-md p-2.5 border border-gray-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        } hover:bg-gray-50 hover:border-blue-400`}
        onClick={() => setShowOptions(!showOptions)}
        onMouseEnter={() => setShowOptions(true)}
        aria-label="Car options"
      >
        <MoreVertical className="h-5 w-5 text-gray-700" />
      </button>

      {/* Options Menu */}
      {showOptions && (
        <div className="absolute top-16 right-3 z-20 w-52 rounded-xl bg-white shadow-sm border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          <button
            onClick={() => onEdit(car.id)}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all group/item"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover/item:bg-blue-200 transition-colors">
              <Pencil className="h-4 w-4 text-blue-600" />
            </div>
            <span>Edit Vehicle</span>
          </button>
          <div className="h-px bg-gray-200 my-1 mx-2" />
          <button
            onClick={() => onDelete(car.id)}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all group/item"
          >
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center group-hover/item:bg-red-200 transition-colors">
              <Trash2 className="h-4 w-4 text-red-600" />
            </div>
            <span>Delete Vehicle</span>
          </button>
        </div>
      )}
    </div>
  );
}
