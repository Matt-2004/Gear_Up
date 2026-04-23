import { CarStatus } from "@/app/features/car/types/car.types";
import { Check, ChevronDown, Filter } from "lucide-react";

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
    { label: "All Vehicles", status: "All", count: carCounts.total },
    { label: "Pending", status: "Pending", count: carCounts.pending },
    { label: "Approved", status: "Approved", count: carCounts.approved },
    { label: "Rejected", status: "Rejected", count: carCounts.rejected },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggleDropdown}
        className="flex items-center gap-2  bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1"
      >
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="hidden sm:inline">
          {filter === "All" ? "All Status" : filter}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={onToggleDropdown} />
          <div className="animate-in fade-in zoom-in-95 absolute right-0 z-30 mt-2 w-64  border border-gray-200 bg-white p-2 shadow-sm shadow-gray-200/50 ring-1 ring-black/5 duration-150">
            <p className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Filter by Status
            </p>
            <ul className="space-y-1">
              {statusOptions.map(({ label, status, count }) => (
                <li key={status}>
                  <button
                    onClick={() => {
                      onFilterChange(status);
                      onToggleDropdown();
                    }}
                    className={`group flex w-full items-center justify-between gap-3  px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      filter === status
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {filter === status && (
                        <Check className="h-4 w-4 text-primary-600" />
                      )}
                      <span
                        className={filter === status ? "font-semibold" : ""}
                      >
                        {label}
                      </span>
                    </div>
                    <span
                      className={` px-2.5 py-0.5 text-xs font-semibold ${
                        filter === status
                          ? "bg-primary-100 text-primary-700"
                          : "bg-gray-100 text-gray-600"
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

export default FilterDropdown;
