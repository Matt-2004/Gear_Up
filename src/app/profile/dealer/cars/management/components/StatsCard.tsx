import { Car, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  variant?: "default" | "yellow" | "green" | "red";
}

const StatsCard = ({ label, value, variant = "default" }: StatsCardProps) => {
  const getIcon = () => {
    switch (variant) {
      case "yellow":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "green":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "red":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Car className="h-5 w-5 text-primary-600" />;
    }
  };

  const getTone = () => {
    switch (variant) {
      case "yellow":
        return "bg-yellow-50";
      case "green":
        return "bg-green-50";
      case "red":
        return "bg-red-50";
      default:
        return "bg-primary-50";
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-5 border border-gray-200  shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center  ${getTone()}`}>
        {getIcon()}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
