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
import { Field } from "@/app/shared/ui/Field";
import { Label } from "@/app/shared/ui/Label";
import { Input } from "@/app/shared/ui/Input";

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
          <Field>
            <Label
              label={filterCategory === "kyc" ? "Search KYC" : "Search Car"}
            />

            <Input
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
          </Field>
        </div>

        {/* KYC Document Type Filter */}
        {filterCategory === "kyc" && (
          <div className="w-full min-w-0 sm:w-64 sm:shrink-0">
            <Field>
              <Label label="Document Type" />

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
            </Field>
          </div>
        )}

        {/* Status Filter */}
        <div className="w-full min-w-0 sm:w-52 sm:shrink-0">
          <Field>
            <Label label="Status" />

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
          </Field>
        </div>
      </div>
    </div>
  );
};
