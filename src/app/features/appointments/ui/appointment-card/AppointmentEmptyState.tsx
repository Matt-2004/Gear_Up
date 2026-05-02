import { AppointmentFilterStatus } from "@/app/features/appointments/types/appointment.types";
import { Calendar } from "lucide-react";

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
        ? "You don't have any appointments yet."
        : "You haven't scheduled any appointments yet."
      : `No ${filter.toLowerCase()} appointments${mode === "dealer" ? " at the moment" : ""}.`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
      <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No appointments found
      </h3>
      <p className="text-gray-600">{emptyMessage}</p>
    </div>
  );
};

export default AppointmentEmptyState;
