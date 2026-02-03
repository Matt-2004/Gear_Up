"use client";

import { CarItems } from "@/app/types/car.types";
import { CursorBaseDTO } from "@/app/types/post.types";
import { SlidersHorizontal } from "lucide-react";
import {
  CarList,
  ConditionalCarFilter,
  DashboardHeader,
  FilterDropdown,
  StatsCard,
} from "./management/components";
import { useCarActions, useCarData, useCarFilters } from "./management/hooks";

const DealerCarDashboard = ({
  carData,
}: {
  carData: Omit<CursorBaseDTO, "items"> & { items: CarItems[] };
}) => {
  const {
    isFilterOpen,
    statusFilter,
    statusDropdownOpen,
    toggleFilters,
    toggleStatusDropdown,
    setStatusFilter,
  } = useCarFilters();

  const { filteredCars, carCounts } = useCarData(carData.items, statusFilter);
  const { handleDelete, handleEdit } = useCarActions();

  return (
    <div
      id="car-main-container"
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatsCard label="Total Cars" value={carCounts.total} />
          <StatsCard
            label="Pending Review"
            value={carCounts.pending}
            variant="yellow"
          />
          <StatsCard
            label="Approved"
            value={carCounts.approved}
            variant="green"
          />
          <StatsCard
            label="Rejected"
            value={carCounts.rejected}
            variant="red"
          />
        </div>

        <div id="car-container" className="flex w-full flex-col gap-6">
          <div
            id="left-side-container"
            className="w-full rounded-2xl bg-white shadow-xl"
          >
            <div
              id="header"
              className="flex items-center justify-between border-b border-gray-200 p-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Vehicles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Browse and manage your car listings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FilterDropdown
                  filter={statusFilter}
                  dropdownOpen={statusDropdownOpen}
                  carCounts={carCounts}
                  onToggleDropdown={toggleStatusDropdown}
                  onFilterChange={setStatusFilter}
                />
                <button
                  onClick={toggleFilters}
                  className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 hover:border-primary-400 transition-all select-none"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>
            {isFilterOpen && (
              <div
                id="conditionalFilter"
                className="w-full bg-gray-50 border-b border-gray-200 p-6"
              >
                <ConditionalCarFilter />
              </div>
            )}
            <div id="cars" className="p-6">
              <CarList
                cars={filteredCars}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerCarDashboard;
