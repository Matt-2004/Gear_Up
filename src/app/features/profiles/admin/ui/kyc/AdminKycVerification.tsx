"use client";

import DataTable from "@/app/features/profiles/admin/ui/dashboard/DataTable";
import StatsCard from "../../../dealer/ui/dealer-management/StatsCard";
import AdminFilterProvider from "../../context/AdminFilterContext";
import { FilterUI } from "../dashboard/FilterUI";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { KycModel } from "../../../dealer/types/kyc.model";

const AdminKycVerification = ({ kyc }: { kyc: CursorResponse<KycModel[]> }) => {
  if (!kyc) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <p className="text-sm text-gray-500">KYC data is currently unavailable.</p>
      </div>
    );
  }

  const kycFilter = (status: string) =>
    kyc.items.filter((item) => item.status === status);

  const kycCounts = {
    pending: kycFilter("Pending").length,
    approved: kycFilter("Approved").length,
    rejected: kycFilter("Rejected").length,
  };

  const allKycCount =
    kycCounts.approved + kycCounts.pending + kycCounts.rejected;

  return (
    <AdminFilterProvider>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Document Verification
            </h1>
            <p className="text-sm text-gray-500">
              Review and verify user-submitted documents
            </p>
          </div>

          {/* Stats Cards */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              KYC Status
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                label="All KYC"
                value={allKycCount}
                variant="default"
                description="Total submissions"
                category="KYC"
              />
              <StatsCard
                label="Pending KYC"
                value={kycCounts.pending}
                variant="yellow"
                description="Awaiting review"
              />
              <StatsCard
                label="Approved KYC"
                value={kycCounts.approved}
                variant="green"
                description="Verified dealers"
              />
              <StatsCard
                label="Rejected KYC"
                value={kycCounts.rejected}
                variant="red"
                description="Declined"
              />
            </div>
          </section>

          {/* Filter + Table */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <FilterUI category="Kyc" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <DataTable data={{ type: "kyc", data: kyc.items }} />
            </div>
          </div>
        </div>
      </div>
    </AdminFilterProvider>
  );
};

export default AdminKycVerification;
