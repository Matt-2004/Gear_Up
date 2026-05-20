"use client";

import ResponsiveDropdown from "@/app/shared/ui/ResponsiveDropDown";
import { useEffect, useMemo, useState } from "react";
import {
  useAdminFilterContext,
  KycDocumentType,
  KycStatusType,
  CarStatusType,
} from "../../context/AdminFilterContext";
import { debounce } from "@/app/shared/utils/debounce";
import { Search } from "lucide-react";

type FilterUIProps = {
  category: "Kyc" | "Car";
};

type DropdownOption<T extends string = string> = {
  label: string;
  value: T;
};

const documentTypeOptions: DropdownOption<KycDocumentType>[] = [
  { label: "All", value: "All" },
  { label: "Passport", value: "Passport" },
  { label: "National ID", value: "NationalID" },
  { label: "Driver License", value: "DriverLicense" },
  { label: "Utility Bill", value: "UtilityBill" },
  { label: "Other", value: "Other" },
];

const kycStatusOptions: DropdownOption<KycStatusType>[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const carStatusOptions: DropdownOption<CarStatusType>[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

export const FilterUI = ({ category }: FilterUIProps) => {
  const { filter, setFilter } = useAdminFilterContext();

  const filterCategory = category === "Kyc" ? "kyc" : "car";

  const [searchValue, setSearchValue] = useState(filter.searchData);

  useEffect(() => {
    setFilter({ category: filterCategory });
  }, [filterCategory, setFilter]);

  const statusOptions =
    filterCategory === "kyc" ? kycStatusOptions : carStatusOptions;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilter({ searchData: value });
      }, 400),
    [setFilter],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      {/* Search Input */}
      <div className="min-w-0 flex-1 sm:min-w-[280px] sm:max-w-md">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          {filterCategory === "kyc" ? "Search KYC" : "Search Cars"}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            placeholder={
              filterCategory === "kyc"
                ? "Search by name, ID, or document type..."
                : "Search by title, make, model, or status..."
            }
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {/* KYC Document Type Filter */}
      {filterCategory === "kyc" && (
        <div className="w-full sm:w-52 sm:shrink-0">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Document Type
          </label>
          <ResponsiveDropdown
            options={documentTypeOptions}
            value={filter.category === "kyc" ? filter.documentType : "All"}
            placeholder="Select document type"
            onChange={(value) =>
              setFilter({ documentType: value as KycDocumentType })
            }
          />
        </div>
      )}

      {/* Status Filter */}
      <div className="w-full sm:w-44 sm:shrink-0">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Status
        </label>
        <ResponsiveDropdown
          options={statusOptions}
          value={filter.statusType}
          placeholder="Select status"
          onChange={(value) => {
            if (filterCategory === "kyc") {
              setFilter({ statusType: value as KycStatusType });
              return;
            }
            setFilter({ statusType: value as CarStatusType });
          }}
        />
      </div>
    </div>
  );
};
