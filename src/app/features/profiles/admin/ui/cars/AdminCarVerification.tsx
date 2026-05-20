"use client";

import DataTable from "../dashboard/DataTable";
import StatsCard from "../../../dealer/ui/dealer-management/StatsCard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import AdminFilterProvider from "../../context/AdminFilterContext";
import { FilterUI } from "../dashboard/FilterUI";
import { CarModel } from "@/app/features/car/types/car.model";

const AdminCarVerification = ({
  cars,
}: {
  cars: CursorResponse<CarModel[]>;
}) => {
  if (!cars) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <p className="text-sm text-gray-500">Car data is currently unavailable.</p>
      </div>
    );
  }

  const carFilter = (status: string) =>
    cars.items.filter(
      (car) => car.status?.toLowerCase() === status.toLowerCase(),
    );

  const carCounts = {
    pending: carFilter("Pending").length,
    approved: carFilter("Approved").length,
    rejected: carFilter("Rejected").length,
  };

  return (
    <AdminFilterProvider>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Car Verification
            </h1>
            <p className="text-sm text-gray-500">
              Review and verify dealer-submitted car listings
            </p>
          </div>

          {/* Stats Cards */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Overview
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                label="All Cars"
                value={cars.items.length}
                variant="default"
                description="Total listings"
              />
              <StatsCard
                label="Pending Cars"
                value={carCounts.pending}
                variant="yellow"
                description="Awaiting review"
              />
              <StatsCard
                label="Approved Cars"
                value={carCounts.approved}
                variant="green"
                description="Live on platform"
              />
              <StatsCard
                label="Rejected Cars"
                value={carCounts.rejected}
                variant="red"
                description="Declined"
              />
            </div>
          </section>

          {/* Filter + Table */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <FilterUI category="Car" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <DataTable data={{ type: "car", data: cars.items }} />
            </div>
          </div>
        </div>
      </div>
    </AdminFilterProvider>
  );
};

export default AdminCarVerification;
