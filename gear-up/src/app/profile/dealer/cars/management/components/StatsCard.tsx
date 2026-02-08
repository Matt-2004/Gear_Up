import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  variant?: "default" | "yellow" | "green" | "red";
}

const StatsCard = ({ label, value, variant = "default" }: StatsCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "yellow":
        return "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 text-yellow-800 hover:shadow-yellow-200/50";
      case "green":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-800 hover:shadow-green-200/50";
      case "red":
        return "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 text-red-800 hover:shadow-red-200/50";
      default:
        return "bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-600 hover:shadow-blue-200/50";
    }
  };

  const getValueClasses = () => {
    switch (variant) {
      case "yellow":
        return "text-yellow-900";
      case "green":
        return "text-green-900";
      case "red":
        return "text-red-900";
      default:
        return "text-gray-900";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "yellow":
        return "text-yellow-500";
      case "green":
        return "text-green-500";
      case "red":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-6 border transition-all duration-150 cursor-pointer ${getVariantClasses()}`}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp className={`h-5 w-5 ${getIconColor()}`} />
      </div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <p
        className={`text-3xl font-bold transition-all duration-150 ${getValueClasses()}`}
      >
        {value}
      </p>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-current opacity-50 group-hover:w-full transition-all duration-150"></div>
    </div>
  );
};

export default StatsCard;
