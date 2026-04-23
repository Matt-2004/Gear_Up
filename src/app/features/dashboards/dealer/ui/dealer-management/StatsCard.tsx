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
}

const StatsCard = ({
  label,
  value,
  description,
  category,
  variant = "default",
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

  return (
    <div
      className={`border-l-2 ${getTone()} items-center gap-4 bg-white p-5   shadow-sm`}
    >
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {getIcon()}
        </div>
        <div>
          <h3 className="flex flex-col font-semibold text-3xl tracking-tight text-gray-900">
            {value}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
