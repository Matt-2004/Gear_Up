"use client";

import ResponsiveDropdown from "@/app/shared/ui/ResponsiveDropDown";
import { useEffect, useMemo, useState } from "react";
import {
  FillDetailField,
  FillDetailLabel,
  FillDetailInput,
} from "../../../dealer/ui/add-car-form/FillDetailFormComponents";
import {
  useAdminFilterContext,
  KycDocumentType,
  KycStatusType,
  CarStatusType,
} from "../../context/AdminFilterContext";
import { debounce } from "@/app/shared/utils/debounce";

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
    setFilter({
      category: filterCategory,
    });
  }, [filterCategory, setFilter]);

  const statusOptions =
    filterCategory === "kyc" ? kycStatusOptions : carStatusOptions;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilter({
          searchData: value,
        });
      }, 400),
    [setFilter],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        {/* Search Input */}
        <div className="min-w-100">
          <FillDetailField>
            <FillDetailLabel
              label={filterCategory === "kyc" ? "Search KYC" : "Search Car"}
            />

            <FillDetailInput
              type="text"
              value={searchValue}
              placeholder={
                filterCategory === "kyc"
                  ? "Search by name, ID, or document type..."
                  : "Search by title, make, model, or status..."
              }
              onChange={handleSearchChange}
              className="w-full"
            />
          </FillDetailField>
        </div>

        {/* KYC Document Type Filter */}
        {filterCategory === "kyc" && (
          <div className="w-full min-w-0 sm:w-64 sm:shrink-0">
            <FillDetailField>
              <FillDetailLabel label="Document Type" />

              <ResponsiveDropdown
                options={documentTypeOptions}
                value={filter.category === "kyc" ? filter.documentType : "All"}
                placeholder="Select document type"
                onChange={(value) =>
                  setFilter({
                    documentType: value as KycDocumentType,
                  })
                }
              />
            </FillDetailField>
          </div>
        )}

        {/* Status Filter */}
        <div className="w-full min-w-0 sm:w-52 sm:shrink-0">
          <FillDetailField>
            <FillDetailLabel label="Status" />

            <ResponsiveDropdown
              options={statusOptions}
              value={filter.statusType}
              placeholder="Select status"
              onChange={(value) => {
                if (filterCategory === "kyc") {
                  setFilter({
                    statusType: value as KycStatusType,
                  });
                  return;
                }

                setFilter({
                  statusType: value as CarStatusType,
                });
              }}
            />
          </FillDetailField>
        </div>
      </div>
    </div>
  );
};
