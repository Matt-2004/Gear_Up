import { Calendar } from "lucide-react";
import { AppointmentFilterStatus } from "../../types/appointment.dto";

interface AppointmentEmptyStateProps {
  filter: AppointmentFilterStatus;
  mode?: "dealer" | "user";
}

const AppointmentEmptyState = ({
  filter,
  mode = "user",
}: AppointmentEmptyStateProps) => {
  const emptyMessage =
    filter === "All"
      ? mode === "dealer"
        ? "Appointments will appear here once customers book a time."
        : "Your booked appointments will show up here once scheduled."
      : `No ${filter.toLowerCase()} appointments${mode === "dealer" ? " right now" : " yet"}.`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
      <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No appointments yet
      </h3>
      <p className="text-gray-600">{emptyMessage}</p>
    </div>
  );
};

export default AppointmentEmptyState;
