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

const variantConfig = {
  default: {
    iconBg: "bg-primary-50",
    iconColor: "text-primary-600",
    badge: { text: "Summary", className: "bg-blue-50 text-blue-700" },
  },
  yellow: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badge: { text: "Review", className: "bg-amber-50 text-amber-700" },
  },
  green: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: { text: "Healthy", className: "bg-emerald-50 text-emerald-700" },
  },
  red: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    badge: { text: "Action", className: "bg-rose-50 text-rose-700" },
  },
};

const categoryIcon: Record<string, React.ReactNode> = {
  Appointment: <Calendar className="h-5 w-5" />,
  KYC: <FileUser className="h-5 w-5" />,
  Car: <Car className="h-5 w-5" />,
};

const variantIcon: Record<string, React.ReactNode> = {
  yellow: <Clock className="h-5 w-5" />,
  green: <CheckCircle className="h-5 w-5" />,
  red: <XCircle className="h-5 w-5" />,
};

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
  const config = variantConfig[variant];
  const icon = variantIcon[variant] ?? (category ? categoryIcon[category] : null);

  return (
    <div
      className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50"
      data-testid="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-gray-900">
            {value.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>

        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.badge.className}`}
        >
          {config.badge.text}
        </span>

        {actionVisible && actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
