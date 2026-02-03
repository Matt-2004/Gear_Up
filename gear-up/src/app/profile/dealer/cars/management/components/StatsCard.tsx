interface StatsCardProps {
  label: string;
  value: number;
  variant?: "default" | "yellow" | "green" | "red";
}

const StatsCard = ({ label, value, variant = "default" }: StatsCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "yellow":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "green":
        return "bg-green-50 border-green-200 text-green-800";
      case "red":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-white border-gray-200 text-gray-600";
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

  return (
    <div className={`rounded-lg p-6 shadow-sm border ${getVariantClasses()}`}>
      <p className="text-sm">{label}</p>
      <p className={`text-2xl font-bold ${getValueClasses()}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
