import { AppointmentStatus } from "@/app/types/appointment.types";
import { ChevronDown, Filter } from "lucide-react";

interface FilterDropdownProps {
    filter: AppointmentStatus | "All";
    dropdownOpen: boolean;
    onToggleDropdown: () => void;
    onFilterChange: (filter: AppointmentStatus | "All") => void;
}

const FilterDropdown = ({
    filter,
    dropdownOpen,
    onToggleDropdown,
    onFilterChange,
}: FilterDropdownProps) => {
    const statusOptions: (AppointmentStatus | "All")[] = [
        "All",
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Rejected",
    ];

    return (
        <div className="relative">
            <button
                onClick={onToggleDropdown}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <Filter className="h-4 w-4" />
                {filter === "All" ? "All Status" : filter}
                <ChevronDown className="h-4 w-4" />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                onFilterChange(status);
                                onToggleDropdown();
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                            {status}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
