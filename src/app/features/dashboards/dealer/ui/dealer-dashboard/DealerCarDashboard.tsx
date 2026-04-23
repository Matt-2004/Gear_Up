"use client";

import { CarsCursorDTO } from "@/types/car.types";
import { SlidersHorizontal } from "lucide-react";
import DashboardHeader from "../dealer-management/DashboardHeader";
import StatsCard from "../dealer-management/StatsCard";
import ConditionalCarFilter from "../dealer-management/ConditionalCarFilter";
import CarList from "../dealer-management/CarList";
import {
  useCarFilters,
  useCarData,
  useCarActions,
} from "../../../../../profile/dealer/management/hooks";

const DealerCarDashboard = ({ carData }: { carData: CarsCursorDTO }) => {
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
    <div id="car-main-container" className="min-h-screen bg-gray-50 ">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="All Listings"
            description="View and manage all your listings in one place"
            value={carCounts.total}
          />
          <StatsCard
            label="Under Review"
            value={carCounts.pending}
            variant="yellow"
            description="We're checking your listing"
          />
          <StatsCard
            label="Published"
            value={carCounts.approved}
            variant="green"
            description="Visible to customers"
          />
          <StatsCard
            label="Needs Attention"
            value={carCounts.rejected}
            variant="red"
            description="Please update and resubmit"
          />
        </div>

        <div id="car-container" className="flex w-full bg-white flex-col gap-6">
          <div
            id="left-side-container"
            className="w-full rounded-2xl  shadow-sm backdrop-blur-sm"
          >
            <div
              id="header"
              className="flex flex-col items-start justify-between gap-4 shadow-sm p-6 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Vehicles
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Browse and manage your car listings
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={toggleFilters}
                  className="flex items-center gap-2 rounded-xl  bg-white px-5 py-2.5 font-semibold text-gray-700 transition-all select-none hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="hidden sm:inline">
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                  </span>
                  <span className="sm:hidden">Filters</span>
                </button>
              </div>
            </div>
            {isFilterOpen && (
              <div
                id="conditionalFilter"
                className="animate-in slide-in-from-top w-full border-b border-gray-200/70 bg-blue-50 p-6 duration-150"
              >
                <ConditionalCarFilter />
              </div>
            )}
            <div id="cars">
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
