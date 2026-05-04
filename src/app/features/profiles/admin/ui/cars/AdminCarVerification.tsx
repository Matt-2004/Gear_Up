"use client";

import DataTable from "../dashboard/DataTable";
import StatsCard from "../../../dealer/ui/dealer-management/StatsCard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import AdminFilterProvider, {
  CarStatusType,
} from "../../context/AdminFilterContext";
import { FilterUI } from "../dashboard/FilterUI";
import { CarModel } from "@/app/features/car/types/car.model";

const AdminCarVerification = ({
  cars,
}: {
  cars: CursorResponse<CarModel[]>;
}) => {
  if (!cars) {
    return <h3>Car data missing</h3>;
  }
  console.log("Car verification data:", cars);

  const carFilter = (status: Omit<CarStatusType, "All">) =>
    cars.items.filter((car) => car.status === status);

  const carCounts = {
    pending: carFilter("Pending").length,
    approved: carFilter("Approved").length,
    rejected: carFilter("Rejected").length,
  };

  return (
    <AdminFilterProvider>
      <div className="from-primary-50 to-primary-100/50 min-h-screen via-white p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Car Verification
            </h1>
            <p className="text-sm text-gray-500">
              Review and verify dealer-submitted car listings
            </p>
          </div>{" "}
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="All"
              value={cars.items.length}
              variant="default"
              description=""
              category="Car"
            />
            <StatsCard
              label="Pending Cars"
              value={carCounts.pending}
              variant="yellow"
              description=""
            />
            <StatsCard
              label="Approved Cars"
              value={carCounts.approved}
              variant="green"
              description=""
            />
            <StatsCard
              label="Rejected Cars"
              value={carCounts.rejected}
              variant="red"
              description=""
            />
          </div>
          {/* Filter Section */}
          <div className=" bg-white p-6 shadow-sm shadow-gray-100">
            <FilterUI category="Car" />
          </div>
          {/* Data Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <DataTable data={{ type: "car", data: cars.items }} />
          </div>
        </div>
      </div>
    </AdminFilterProvider>
  );
};

export default AdminCarVerification;
