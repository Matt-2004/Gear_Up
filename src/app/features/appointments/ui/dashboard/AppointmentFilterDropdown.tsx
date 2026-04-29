import {
  AppointmentFilterStatus,
  AppointmentStatus,
} from "@/app/features/appointments/types/appointment.types";
import { ChevronDown, Filter } from "lucide-react";

interface AppointmentFilterDropdownProps {
  filter: AppointmentFilterStatus;
  dropdownOpen: boolean;
  appointmentCounts: {
    total: number;
    pending: number;
    confirmed?: number;
    completed?: number;
    cancelled: number;
    rejected?: number;
  };
  onToggleDropdown: () => void;
  onFilterChange: (filter: AppointmentFilterStatus) => void;
}

const AppointmentFilterDropdown = ({
  filter,
  dropdownOpen,
  appointmentCounts,
  onToggleDropdown,
  onFilterChange,
}: AppointmentFilterDropdownProps) => {
  const rawOptions: { label: string; status: AppointmentFilterStatus; count: number }[] = [
    { label: "All", status: "All", count: appointmentCounts.total },
    { label: "Pending", status: "Pending", count: appointmentCounts.pending },
    {
      label: "Cancelled",
      status: "Cancelled",
      count: appointmentCounts.cancelled,
    },
    {
      label: "Confirmed",
      status: "Scheduled" as AppointmentStatus,
      count: appointmentCounts.confirmed ?? 0,
    },
    {
      label: "Completed",
      status: "Completed",
      count: appointmentCounts.completed ?? 0,
    },
    {
      label: "Rejected",
      status: "Rejected",
      count: appointmentCounts.rejected ?? 0,
    },
  ];

  const statusOptions = rawOptions.filter((opt) => opt.count !== undefined);

  return (
    <div className="relative">
      <button
        onClick={onToggleDropdown}
        className="flex items-center gap-2 rounded-lg  bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-1 focus:ring-primary-500 "
      >
        <Filter className="h-4 w-4" />
        {filter === "All" ? "All Status" : filter}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={onToggleDropdown} />
          <div className="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
            <ul className="p-1">
              {statusOptions.map(({ label, status, count }) => (
                <li key={status}>
                  <button
                    onClick={() => {
                      onFilterChange(status);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${
                      filter === status
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        filter === status
                          ? "bg-primary-100 text-primary-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentFilterDropdown;
