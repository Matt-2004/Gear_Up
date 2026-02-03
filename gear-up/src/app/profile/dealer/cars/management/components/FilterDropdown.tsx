import { CarStatus } from "@/app/types/car.types";
import { ChevronDown, Filter } from "lucide-react";

interface FilterDropdownProps {
  filter: CarStatus | "All";
  dropdownOpen: boolean;
  carCounts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  onToggleDropdown: () => void;
  onFilterChange: (filter: CarStatus | "All") => void;
}

const FilterDropdown = ({
  filter,
  dropdownOpen,
  carCounts,
  onToggleDropdown,
  onFilterChange,
}: FilterDropdownProps) => {
  const statusOptions: {
    label: string;
    status: CarStatus | "All";
    count: number;
  }[] = [
    { label: "All", status: "All", count: carCounts.total },
    { label: "Pending", status: "Pending", count: carCounts.pending },
    { label: "Approved", status: "Approved", count: carCounts.approved },
    { label: "Rejected", status: "Rejected", count: carCounts.rejected },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggleDropdown}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-primary-50 transition-colors ${
                      filter === status
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
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

export default FilterDropdown;
