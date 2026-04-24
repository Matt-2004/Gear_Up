"use client";

import DashboardHeader from "@/app/features/dashboards/dealer/ui/dealer-management/DashboardHeader";
import StatsCard from "@/app/features/dashboards/dealer/ui/dealer-management/StatsCard";
import ConditionalCarFilter from "@/app/features/dashboards/dealer/ui/dealer-management/ConditionalCarFilter";
import CarList from "@/app/features/dashboards/dealer/ui/dealer-management/CarList";
import { CarItems } from "@/app/features/car/types/car.types";
import { getMyCars } from "@/app/shared/utils/API/CarAPI";
import { SlidersHorizontal, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useCarActions } from "../../hooks/useCarActions";
import { useCarData } from "../../hooks/useCarData";
import { useCarFilters } from "../../hooks/useCarFilters";

const CarManagement = () => {
  const [cars, setCars] = useState<CarItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const [approved, pending, rejected] = await Promise.all([
          getMyCars("approved", null),
          getMyCars("pending", null),
          getMyCars("rejected", null),
        ]);
        const allCars = [
          ...(approved?.items || []),
          ...(pending?.items || []),
          ...(rejected?.items || []),
        ];
        setCars(allCars);
      } catch (e) {
        setCars([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const {
    isFilterOpen,
    statusFilter,
    statusDropdownOpen,
    toggleFilters,
    toggleStatusDropdown,
    setStatusFilter,
  } = useCarFilters();

  const { filteredCars: initialFilteredCars, carCounts } = useCarData(
    cars,
    statusFilter,
  );
  // Add simple search
  const filteredCars = initialFilteredCars.filter((c) =>
    (c.make + " " + c.model + " " + c.title)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const { handleDelete, handleEdit } = useCarActions();

  if (loading) {
    return (
      <div className="flex flex-col gap-6 bg-transparent px-2 py-6 sm:px-0">
        <div className="h-20 w-1/3 animate-pulse bg-gray-200 " />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse bg-gray-200 " />
          ))}
        </div>
        <div className="h-96 w-full animate-pulse bg-gray-200 " />
      </div>
    );
  }

  return (
    <div
      id="car-main-container"
      className="flex flex-col gap-6 bg-transparent px-2 py-6 sm:px-0 lg:px-4"
    >
      <div className="mx-auto w-full max-w-7xl">
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total Inventory"
            value={carCounts.total}
            description={""}
          />
          <StatsCard
            label="Pending Review"
            value={carCounts.pending}
            variant="yellow"
            description={""}
          />
          <StatsCard
            label="Active Listings"
            value={carCounts.approved}
            variant="green"
            description={""}
          />
          <StatsCard
            label="Needs Attention"
            value={carCounts.rejected}
            variant="red"
            description={""}
          />
        </div>

        {/* Main Car List Container */}
        <div className="flex w-full flex-col">
          {/* Toolbar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full  border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={toggleFilters}
                className={`inline-flex items-center gap-2  border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${isFilterOpen ? "bg-gray-100 border-gray-400" : ""}`}
              >
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <span className="hidden sm:inline">Advanced Filters</span>
                <span className="sm:hidden">Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Drawer/Panel */}
          {isFilterOpen && (
            <div className="mb-6 animate-in slide-in-from-top-2 w-full  border border-gray-200 bg-white p-5 shadow-sm duration-150">
              <ConditionalCarFilter />
            </div>
          )}

          {/* List output */}
          <div id="cars" className="bg-transparent">
            <CarList
              cars={filteredCars}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarManagement;
