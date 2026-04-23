"use client";

import { IKycSubmissions } from "@/types/kyc.types";
import { CursorBaseDTO } from "@/types/post.types";
import DataTable from "@/app/features/dashboards/admin/ui/dashboard/DataTable";
import FilterProvider, {
  KycDocumentType,
  StatusType,
  useKycFilterContext,
} from "@/Context/AdminKycFilterContext";
import { Search, SlidersHorizontal } from "lucide-react";

import AdminCarFilterProvider from "@/Context/AdminCarFilterContext";
import StatsCard from "../../../dealer/ui/dealer-management/StatsCard";

const AdminKycVerification = ({
  kyc,
}: {
  kyc: Omit<CursorBaseDTO, "items"> & { items: IKycSubmissions[] };
}) => {
  if (!kyc) {
    return <h3>Kyc data missing</h3>;
  }

  const kycFilter = (status: Omit<StatusType, "All">) =>
    kyc.items.filter((item) => item.status === status);

  const kycCounts = {
    pending: kycFilter("Pending").length,
    approved: kycFilter("Approved").length,
    rejected: kycFilter("Rejected").length,
  };

  const allKycCounts =
    kycCounts.approved + kycCounts.pending + kycCounts.rejected;

  return (
    <AdminCarFilterProvider>
      <FilterProvider>
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">
                Document Verification
              </h1>
              <p className="text-sm text-gray-500">
                Review and verify user-submitted documents
              </p>
            </div>

            {/* Stats Cards */}
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

            {/* Filter Section */}
            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-100">
              <FilterUI category="Kyc" />
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-100">
              <DataTable data={{ type: "kyc", data: kyc.items }} />
            </div>
          </div>
        </div>
      </FilterProvider>
    </AdminCarFilterProvider>
  );
};

export const FilterUI = ({ category }: { category: "Kyc" | "Car" }) => {
  const { setFilter } = useKycFilterContext();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-4">
        {/* Search Input */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            className="focus:border-primary-500 focus:ring-primary-200 w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            type="text"
            placeholder="Search by name, ID, or document type..."
            onChange={(e) => setFilter({ searchData: e.currentTarget.value })}
          />
        </div>

        {/* Document Type Filter */}
        <div className="relative">
          <select
            name="doc-type"
            id="all-doc-type"
            className="focus:border-primary-500 focus:ring-primary-200 cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 font-medium text-gray-700 transition-all hover:border-gray-300 focus:ring-2 focus:outline-none"
            defaultValue=""
            onChange={(e) =>
              setFilter({
                documentType: e.currentTarget.value as KycDocumentType,
              })
            }
          >
            <option value="" disabled hidden>
              Document Type
            </option>
            <option value="Passport">Passport</option>
            <option value="NationalID">National ID</option>
            <option value="DriverLicense">Driver License</option>
            <option value="UtilityBill">Utility Bill</option>
            <option value="Other">Other</option>
          </select>
          <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            name="status-type"
            id="all-status"
            className="focus:border-primary-500 focus:ring-primary-200 cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 font-medium text-gray-700 transition-all hover:border-gray-300 focus:ring-2 focus:outline-none"
            defaultValue=""
            onChange={(e) =>
              setFilter({ statusType: e.currentTarget.value as StatusType })
            }
          >
            <option value="" disabled hidden>
              Filter Status
            </option>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default AdminKycVerification;
