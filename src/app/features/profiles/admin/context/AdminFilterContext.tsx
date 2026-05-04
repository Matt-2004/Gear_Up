"use client";

import { CarStatus } from "@/app/features/car/types/car.dto";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type FilterCategory = "car" | "kyc";

export type CarStatusType = CarStatus | "All";

export type KycDocumentType =
  | "Passport"
  | "NationalID"
  | "DriverLicense"
  | "UtilityBill"
  | "Other"
  | "All";

export type KycStatusType = "All" | "Pending" | "Approved" | "Rejected";

type BaseFilterState = {
  searchData: string;
  category: FilterCategory;
};

export type CarFilterState = BaseFilterState & {
  category: "car";
  statusType: CarStatusType;
};

export type KycFilterState = BaseFilterState & {
  category: "kyc";
  statusType: KycStatusType;
  documentType: KycDocumentType;
};

export type AdminFilterState = CarFilterState | KycFilterState;

type AdminFilterUpdate = Partial<{
  searchData: string;
  statusType: CarStatusType | KycStatusType;
  category: FilterCategory;
  documentType: KycDocumentType;
}>;

interface AdminFilterContextType {
  filter: AdminFilterState;
  setFilter: (newFilter: AdminFilterUpdate) => void;
  clearFilters: () => void;
}

const initialCarFilter: CarFilterState = {
  category: "car",
  searchData: "",
  statusType: "All",
};

const initialKycFilter: KycFilterState = {
  category: "kyc",
  searchData: "",
  statusType: "All",
  documentType: "All",
};

const AdminFilterContext = createContext<AdminFilterContextType | undefined>(
  undefined,
);

export const useAdminFilterContext = () => {
  const context = useContext(AdminFilterContext);

  if (!context) {
    throw new Error(
      "useAdminFilterContext must be used within AdminFilterProvider",
    );
  }

  return context;
};

const AdminFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilterState] = useState<AdminFilterState>(initialCarFilter);

  const setFilter = useCallback((newFilter: AdminFilterUpdate) => {
    setFilterState((prev) => {
      if (newFilter.category === "car") {
        return {
          ...initialCarFilter,
          searchData: newFilter.searchData ?? prev.searchData,
          statusType: (newFilter.statusType as CarStatusType) ?? "All",
        };
      }

      if (newFilter.category === "kyc") {
        return {
          ...initialKycFilter,
          searchData: newFilter.searchData ?? prev.searchData,
          statusType: (newFilter.statusType as KycStatusType) ?? "All",
          documentType: newFilter.documentType ?? "All",
        };
      }

      if (prev.category === "kyc") {
        return {
          ...prev,
          ...newFilter,
          statusType:
            (newFilter.statusType as KycStatusType) ?? prev.statusType,
          documentType: newFilter.documentType ?? prev.documentType,
        };
      }

      return {
        ...prev,
        searchData: newFilter.searchData ?? prev.searchData,
        statusType: (newFilter.statusType as CarStatusType) ?? prev.statusType,
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState((prev) => {
      if (prev.category === "kyc") {
        return initialKycFilter;
      }

      return initialCarFilter;
    });
  }, []);

  return (
    <AdminFilterContext.Provider value={{ filter, setFilter, clearFilters }}>
      {children}
    </AdminFilterContext.Provider>
  );
};

export default AdminFilterProvider;
