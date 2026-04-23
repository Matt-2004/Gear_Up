"use client";

import { CarStatus } from "@/app/features/car/types/car.types";
import { createContext, useCallback, useContext, useState } from "react";

export type CarStatusType = CarStatus | "All";
export type CarConditionType = "All" | "New" | "Used";
export type FuelTypeFilter =
  | "All"
  | "Petrol"
  | "Diesel"
  | "Electric"
  | "Hybrid";

interface FilterConfig {
  searchData: string;
  statusType: CarStatusType;
  conditionType: CarConditionType;
}

interface FilterContextType {
  filter: FilterConfig;
  setFilter: (newFilter: Partial<FilterConfig>) => void;
  clearFilters: () => void;
}

const initialFilter: FilterConfig = {
  searchData: "",
  statusType: "All",
  conditionType: "All",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useCarFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useCarFilterContext must be used within FilterProvider");
  }
  return context;
};

const AdminCarFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filter, setFilterState] = useState<FilterConfig>(initialFilter);

  const setFilter = useCallback((name: Partial<FilterConfig>) => {
    setFilterState((prev) => ({ ...prev, ...name }));
  }, []);

  const clearFilters = () => {
    setFilterState(initialFilter);
  };
  return (
    <FilterContext.Provider value={{ filter, setFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export default AdminCarFilterProvider;
