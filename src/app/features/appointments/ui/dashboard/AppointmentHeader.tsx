import { AppointmentStatus } from "@/app/features/appointments/types/appointment.types";

export interface AppointmentHeaderProps {
  carTitle: string;
  id: string;
  status: AppointmentStatus;
  getStatusColor: (status: AppointmentStatus) => string;
}

export const AppointmentHeader = ({
  carTitle,
  id,
  status,
  getStatusColor,
}: AppointmentHeaderProps) => {
  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case "Pending":
        return "Waiting for confirmation";
      case "Scheduled":
        return "Confirmed";
      case "Completed":
        return "Completed";
      case "Rejected":
        return "Not Accepted";
      case "NoShow":
        return "Missed Appointment";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
            {carTitle}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Booking ID:{" "}
            <span className="font-mono text-gray-400">{id.slice(0, 8)}</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${getStatusColor(
            status,
          )}`}
        >
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  );
};
