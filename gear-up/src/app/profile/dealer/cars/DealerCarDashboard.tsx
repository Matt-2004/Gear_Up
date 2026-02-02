"use client";

import { CarItems } from "@/app/types/car.types";
import { CarCard } from "@/components/Car/CarCard";
import { deleteCarById } from "@/utils/API/CarAPI";
import {
  CarFront,
  MoreVertical,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

const DealerCarDashboard = ({ carData }: { carData: CarItems[] }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      await deleteCarById(carId);
      // Refresh the page or update state
      window.location.reload();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("An error occurred while deleting the vehicle");
    }
  };

  const handleEdit = (carId: string) => {
    router.push(`/profile/dealer/cars/edit/${carId}`);
  };

  return (
    <div
      id={"car-main-container"}
      className={
        "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8"
      }
    >
      <div className={"mx-auto max-w-7xl"}>
        <div className={"mb-8 flex items-start justify-between"}>
          <div className="space-y-2">
            <h1 className={"text-4xl font-bold text-gray-900"}>
              Vehicle Inventory
            </h1>
            <p className={"text-base text-gray-600"}>
              Manage your inventory, sales, and performance all in one place.
            </p>
          </div>
          <Link href="/profile/dealer/cars/add?step=1">
            <button className="flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg">
              <Plus className="h-5 w-5" />
              Add Vehicle
            </button>
          </Link>
        </div>
        <div id={"car-container"} className={"flex w-full flex-col gap-6"}>
          <div
            id={"left-side-container"}
            className={"w-full rounded-2xl bg-white shadow-xl"}
          >
            <div
              id={"header"}
              className={
                "flex items-center justify-between border-b border-gray-200 p-6"
              }
            >
              <div>
                <h2 className={"text-2xl font-bold text-gray-900"}>
                  Available Vehicles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Browse and manage your car listings
                </p>
              </div>
              <button
                onClick={() => setIsFilterOpen((prevState) => !prevState)}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 hover:border-primary-400 transition-all select-none"
              >
                <SlidersHorizontal className="h-5 w-5" />
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
            {isFilterOpen && (
              <div
                id="conditionalFilter"
                className="w-full bg-gray-50 border-b border-gray-200 p-6"
              >
                <ConditionalCarFilter />
              </div>
            )}
            <div id={"cars"} className={"p-6"}>
              {carData && carData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {carData.map((car: CarItems, index: number) => (
                    <div
                      key={car.id || index}
                      className="relative group"
                      onMouseEnter={() => setHoveredCardId(car.id)}
                      onMouseLeave={() => {
                        setHoveredCardId(null);
                        setShowOptionsId(null);
                      }}
                    >
                      <CarCard carItem={car} />

                      {/* Options Icon */}
                      <button
                        className={`absolute top-3 right-3 z-10 rounded-lg bg-white/95 backdrop-blur-sm p-2 shadow-lg border border-gray-200 transition-all ${hoveredCardId === car.id ? "opacity-100" : "opacity-0"
                          } hover:bg-gray-50`}
                        onClick={() =>
                          setShowOptionsId(
                            showOptionsId === car.id ? null : car.id,
                          )
                        }
                        onMouseEnter={() => setShowOptionsId(car.id)}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-700" />
                      </button>

                      {/* Options Menu */}
                      {showOptionsId === car.id && (
                        <div className="absolute top-14 right-3 z-20 w-48 rounded-lg bg-white shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button
                            onClick={() => handleEdit(car.id)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Edit Vehicle</span>
                          </button>
                          <div className="h-px bg-gray-200 my-1" />
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="font-medium">Delete Vehicle</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-30"></div>
                    <div className="relative mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border-4 border-white shadow-xl">
                      <CarFront className="h-16 w-16 text-primary-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Your Inventory is Empty
                  </h3>
                  <p className="text-base text-gray-600 mb-2 max-w-md text-center">
                    Start building your vehicle inventory by adding your first
                    car listing.
                  </p>
                  <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
                    Showcase your vehicles to thousands of potential buyers and
                    grow your dealership.
                  </p>
                  <Link href="/profile/dealer/cars/add?step=1">
                    <button className="flex items-center gap-2 rounded-lg bg-primary-500 px-8 py-3.5 font-semibold text-white hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                      <Plus className="h-5 w-5" />
                      Add Your First Vehicle
                    </button>
                  </Link>
                  <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl">
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-blue-50 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Easy Listing
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-green-50 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        High Visibility
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-purple-50 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        Boost Sales
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ConditionalCarFilter() {
  return (
    <div id={"filter-container"} className={"w-full"}>
      <div className="flex w-full flex-col gap-6">
        <div id="year" className={"space-y-2"}>
          <label className="text-sm font-semibold text-gray-700">
            Year Range
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="year"
              placeholder="1990"
              min={1990}
              max={2026}
              className={
                "w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              }
            />
            <span className="text-gray-500 font-medium">to</span>
            <input
              type="number"
              placeholder="2026"
              name="year"
              min={1990}
              max={2026}
              className={
                "w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              }
            />
          </div>
        </div>
        <div id="price" className={"space-y-2"}>
          <label className="text-sm font-semibold text-gray-700">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ฿
              </span>
              <input
                type="number"
                name="price"
                placeholder="Min"
                className={
                  "w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                }
              />
            </div>
            <span className="text-gray-500 font-medium">to</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ฿
              </span>
              <input
                type="number"
                placeholder="Max"
                name="price"
                className={
                  "w-full rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                }
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Brand</label>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center select-none">
              <input
                id="tesla"
                type="checkbox"
                name="make"
                value="Tesla"
                className="peer hidden appearance-none"
              />
              <label
                htmlFor="tesla"
                className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 transition-all hover:border-primary-400 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md"
              >
                <div className="relative h-6 w-20">
                  <Image
                    src="/tesla-text.png"
                    alt="Tesla"
                    fill
                    className="object-contain"
                  />
                </div>
              </label>
            </div>
            <div className="flex items-center select-none">
              <input
                id="toyota"
                type="checkbox"
                name="make"
                value="Toyota"
                className="peer hidden appearance-none"
              />
              <label
                htmlFor="toyota"
                className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 transition-all hover:border-primary-400 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-md"
              >
                <div className="relative h-6 w-20">
                  <Image
                    src="/toyota-text.png"
                    alt="Toyota"
                    fill
                    className="object-contain"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealerCarDashboard;
