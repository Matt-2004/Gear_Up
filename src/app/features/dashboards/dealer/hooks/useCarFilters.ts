import { AppointmentFilterStatus } from "@/app/features/appointments/types/appointment.types";
import { useState } from "react";

export function useCarFilters() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentFilterStatus>(
    "All",
  );
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const toggleFilters = () => setIsFilterOpen((prev) => !prev);
  const toggleStatusDropdown = () => setStatusDropdownOpen((prev) => !prev);
  const setStatusWithClose = (status: AppointmentFilterStatus) => {
    setStatusFilter(status);
    setStatusDropdownOpen(false);
  };

  return {
    isFilterOpen,
    statusFilter,
    statusDropdownOpen,
    toggleFilters,
    toggleStatusDropdown,
    setStatusFilter: setStatusWithClose,
  };
}
