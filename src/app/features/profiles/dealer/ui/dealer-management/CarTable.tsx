"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Settings, Car } from "lucide-react";
import Image from "next/image";
import { CarModel } from "@/app/features/car/types/car.model";
import { timeFormat } from "@/app/shared/utils/timeFormat";

interface CarTableProps {
  cars: CarModel[];
  onDelete: (carId: string) => void;
  onEdit: (carId: string) => void;
}

export default function CarTable({ cars, onDelete, onEdit }: CarTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  console.log("Car data:: ", cars);

  const toggleMenu = (id: string) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  if (!Array.isArray(cars) || cars.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Car className="h-7 w-7 text-gray-400" />
        </div>

        <h3 className="text-base font-semibold text-gray-900">
          No vehicles found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-gray-500">
          There are no vehicles available for this status yet. Once vehicles are
          added or approved, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow-sm ">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#F9F9F6]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Vehicle
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Details
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Color
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Created
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Price
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {cars.map((car) => {
            const carName = `${car.make ?? "Unknown"} ${
              car.model ?? "Vehicle"
            }`;

            return (
              <tr
                key={car.id}
                className="transition-colors hover:bg-gray-50/50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                      {car.imageUrl ? (
                        <Image
                          src={car.imageUrl}
                          alt={carName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900">
                        {carName}
                      </div>

                      <div className="text-xs text-gray-500">
                        {car.title ?? "Untitled vehicle"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      {car.mileage?.toLocaleString() ?? 0} km
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Settings className="h-3.5 w-3.5 text-gray-400" />
                      {car.transmission && car.transmission !== "Default"
                        ? car.transmission
                        : "Auto"}{" "}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {car.color}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {timeFormat(new Date(car.createdAt), "Date")}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="font-semibold text-primary">
                    ฿{car.price?.toLocaleString() ?? 0}
                  </div>
                </td>

                <td className="relative whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => toggleMenu(car.id)}
                    onBlur={() => setTimeout(() => setActiveMenuId(null), 200)}
                    className="p-2 text-gray-400 hover:bg-gray-100 cursor-pointer hover:text-gray-600 focus:outline-none"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {activeMenuId === car.id && (
                    <div className="animate-in fade-in zoom-in-95 absolute right-8 top-0 z-20 w-48 overflow-hidden border border-gray-200 bg-white py-1.5 shadow-sm shadow-gray-200/50 ring-1 ring-black/5 duration-100">
                      <button
                        type="button"
                        onClick={() => onEdit(car.id)}
                        className="group/item flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-primary-50 hover:text-primary-600"
                      >
                        <Pencil className="h-4 w-4 text-gray-400 transition-colors group-hover/item:text-primary-600" />
                        Edit Details
                      </button>

                      <div className="mx-2 my-1 h-px bg-gray-100" />

                      <button
                        type="button"
                        onClick={() => onDelete(car.id)}
                        className="group/item flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 transition-colors group-hover/item:text-red-600" />
                        Delete Vehicle
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
