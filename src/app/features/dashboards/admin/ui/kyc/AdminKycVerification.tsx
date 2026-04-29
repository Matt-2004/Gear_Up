"use client";

import { IKycSubmissions } from "@/app/features/dashboards/dealer/types/kyc.types";
import DataTable from "@/app/features/dashboards/admin/ui/dashboard/DataTable";
import StatsCard from "../../../dealer/ui/dealer-management/StatsCard";
import AdminFilterProvider, {
  KycStatusType,
} from "../../context/AdminFilterContext";
import { FilterUI } from "../dashboard/FilterUI";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

const AdminKycVerification = ({
  kyc,
}: {
  kyc: CursorResponse<IKycSubmissions[]>;
}) => {
  if (!kyc) {
    return <h3>Kyc data missing</h3>;
  }

  const kycFilter = (status: Omit<KycStatusType, "All">) =>
    kyc.items.filter((item) => item.status === status);

  const kycCounts = {
    pending: kycFilter("Pending").length,
    approved: kycFilter("Approved").length,
    rejected: kycFilter("Rejected").length,
  };

  const allKycCounts =
    kycCounts.approved + kycCounts.pending + kycCounts.rejected;

  return (
    <AdminFilterProvider>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Document Verification
            </h1>
            <p className="text-sm text-gray-500">
              Review and verify user-submitted documents
            </p>
          </div>

          {/* Stats Cards */}
          <div className="space-y-2">
            <h3 className="text font-semibold text-gray-900">KYC Status</h3>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                label="All KYC"
                value={allKycCounts}
                variant="default"
                description=""
                category="KYC"
              />
              <StatsCard
                label="Pending KYC"
                value={kycCounts.pending}
                variant="yellow"
                description=""
              />
              <StatsCard
                label="Approved KYC"
                value={kycCounts.approved}
                variant="green"
                description=""
              />
              <StatsCard
                label="Rejected KYC"
                value={kycCounts.rejected}
                variant="red"
                description=""
              />
            </div>
          </div>
          {/* Filter Section */}
          <div className=" bg-white p-6 shadow-sm shadow-gray-100">
            <FilterUI category="Kyc" />
          </div>

          {/* Data Table */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-100">
            <DataTable data={{ type: "kyc", data: kyc.items }} />
          </div>
        </div>
      </div>
    </AdminFilterProvider>
  );
};

export default AdminKycVerification;
