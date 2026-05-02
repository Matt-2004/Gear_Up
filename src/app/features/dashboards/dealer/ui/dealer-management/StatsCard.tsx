import {
  Car,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileUser,
} from "lucide-react";

export interface StatsCardProps {
  label: string;
  value: number;
  description: string;
  variant?: "default" | "yellow" | "green" | "red";
  category?: "Appointment" | "Car" | "KYC";
  actionLabel?: string;
  onAction?: () => void;
  actionVisible?: boolean;
}

const StatsCard = ({
  label,
  value,
  description,
  category,
  variant = "default",
  actionLabel,
  onAction,
  actionVisible = false,
}: StatsCardProps) => {
  const getIcon = () => {
    switch (variant) {
      case "yellow":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "green":
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case "red":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        const icon =
          category === "Appointment" ? (
            <Calendar className="h-5 w-5 text-primary" />
          ) : category === "KYC" ? (
            <FileUser className="h-5 w-5 text-primary" />
          ) : (
            <Car className="h-5 w-5 text-primary" />
          );
        return icon;
    }
  };

  const getTone = () => {
    switch (variant) {
      case "yellow":
        return "border-yellow-500";
      case "green":
        return "border-primary";
      case "red":
        return "border-red-500";
      default:
        return "border-primary";
    }
  };

  const getBadge = () => {
    switch (variant) {
      case "yellow":
        return { text: "Review", className: "bg-yellow-50 text-yellow-700" };
      case "green":
        return { text: "Healthy", className: "bg-green-50 text-green-700" };
      case "red":
        return { text: "Action", className: "bg-red-50 text-red-700" };
      default:
        return { text: "Summary", className: "bg-blue-50 text-blue-700" };
    }
  };

  const badge = getBadge();

  return (
    <div className={`border-l-2 ${getTone()} bg-white p-4 shadow-sm`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {label}
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
            >
              {badge.text}
            </span>
          </div>
          {getIcon()}
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
          {actionVisible && actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-3 inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
