import { AppointmentStatus } from "@/app/types/appointment.types";
import { Calendar } from "lucide-react";

interface EmptyStateProps {
  filter: AppointmentStatus | "All";
}

const EmptyState = ({ filter }: EmptyStateProps) => {
  return (
    <div className="rounded-lg bg-white p-12 text-center shadow-sm border border-gray-200">
      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No appointments found
      </h3>
      <p className="text-gray-600">
        {filter === "All"
          ? "You don't have any appointments yet."
          : `No ${filter.toLowerCase()} appointments at the moment.`}
      </p>
    </div>
  );
};

export default EmptyState;
