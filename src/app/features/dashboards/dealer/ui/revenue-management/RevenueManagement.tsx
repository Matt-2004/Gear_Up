import { BarChart3, CalendarDays, TrendingUp, Wallet } from "lucide-react";
import { ReactNode } from "react";

const RevenueManagement = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Overview</h2>
          <p className="mt-1 text-sm text-gray-600">
            Track dealership earnings and performance trends.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Coming Soon
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RevenuePlaceholderCard
          icon={<Wallet className="h-5 w-5 text-blue-600" />}
          title="Total Revenue"
          description="Summary of gross sales from approved transactions."
        />
        <RevenuePlaceholderCard
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          title="Monthly Growth"
          description="Month-over-month change in dealership earnings."
        />
        <RevenuePlaceholderCard
          icon={<CalendarDays className="h-5 w-5 text-purple-600" />}
          title="Period Filters"
          description="Analyze revenue by week, month, quarter, or custom range."
        />
        <RevenuePlaceholderCard
          icon={<BarChart3 className="h-5 w-5 text-amber-600" />}
          title="Insights"
          description="Visual charts for revenue, appointments, and conversion."
        />
      </div>
    </div>
  );
};

const RevenuePlaceholderCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default RevenueManagement;
