"use client";

import { dealerAppointments } from "@/utils/API/AppointmentAPI";
import { getMyCars } from "@/utils/API/CarAPI";
import { getUserReviews } from "@/utils/API/ReviewAPI";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Eye,
  LayoutDashboard,
  MessageSquare,
  Plus,
  RefreshCw,
  Star,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardStats {
  totalCars: number;
  activeCars: number;
  pendingCars: number;
  rejectedCars: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageRating: number;
  totalReviews: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    activeCars: 0,
    pendingCars: 0,
    rejectedCars: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentCars, setRecentCars] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (!loading) setRefreshing(true);

      const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
        getMyCars("approved", null),
        getMyCars("pending", null),
        getMyCars("rejected", null),
      ]);

      const approvedCars = approvedRes?.items || [];
      const pendingCars = pendingRes?.items || [];
      const rejectedCars = rejectedRes?.items || [];

      const appointmentsRes = await dealerAppointments();
      const appointments = appointmentsRes?.items || [];

      const reviewsRes = await getUserReviews();
      const reviews = reviewsRes || [];

      const totalCars =
        approvedCars.length + pendingCars.length + rejectedCars.length;

      const appointmentStats = appointments.reduce(
        (acc: any, apt: any) => {
          if (apt.status === "pending") acc.pending++;
          if (apt.status === "completed") acc.completed++;
          if (apt.status === "cancelled") acc.cancelled++;
          return acc;
        },
        { pending: 0, completed: 0, cancelled: 0 },
      );

      const avgRating =
        reviews.length > 0
          ? reviews.reduce(
              (sum: number, review: any) => sum + (review.rating || 0),
              0,
            ) / reviews.length
          : 0;

      setStats({
        totalCars,
        activeCars: approvedCars.length,
        pendingCars: pendingCars.length,
        rejectedCars: rejectedCars.length,
        totalAppointments: appointments.length,
        pendingAppointments: appointmentStats.pending,
        completedAppointments: appointmentStats.completed,
        cancelledAppointments: appointmentStats.cancelled,
        averageRating: avgRating,
        totalReviews: reviews.length,
      });

      setRecentCars(approvedCars.slice(0, 5));
      setRecentAppointments(appointments.slice(0, 5));

      const monthlyData = [
        { name: "Jan", sales: 4000, visits: 2400 },
        { name: "Feb", sales: 3000, visits: 1398 },
        { name: "Mar", sales: 2000, visits: 9800 },
        { name: "Apr", sales: 2780, visits: 3908 },
        { name: "May", sales: 1890, visits: 4800 },
        { name: "Jun", sales: 2390, visits: 3800 },
      ];
      setChartData(monthlyData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:border border-gray-200 bg-white p-4 md:p-6 gap-4 md:gap-6">
        <div className="h-10 w-1/3 animate-pulse bg-gray-200" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-0 divide-x divide-y divide-gray-200 border border-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse bg-gray-50/50" />
          ))}
        </div>
        <div className="mt-4 h-64 animate-pulse bg-gray-50/50 border border-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <section className="border-b border-gray-200 px-3 py-3 md:px-5 md:py-4 bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors ${refreshing ? "animate-spin text-primary-600" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </section>

      {/* Quick Actions (Moved below header for better hierarchy) */}
      <section className="bg-gray-50/10 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-gray-200">
          <ActionButton
            href="/profile/dealer/cars/add?step=1"
            label="Add New Car"
            description="Create listing"
            icon={<Plus className="h-5 w-5" />}
          />
          <ActionButton
            href="?tab=test-drive-management"
            label="Appointments"
            description="Manage test drives"
            icon={<Calendar className="h-5 w-5" />}
          />
          <ActionButton
            href="?tab=post-management"
            label="Manage Posts"
            description="Create and edit"
            icon={<MessageSquare className="h-5 w-5" />}
          />
          <ActionButton
            href="?tab=revenue-management"
            label="Revenue"
            description="View revenue section"
            icon={<Star className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Metrics Row 1: Cars & Ratings */}
      <section className="border-b border-gray-200 bg-gray-50/30">
        <h3 className="border-b border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 md:px-5">
          Vehicle Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-gray-200 [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:md:border-l-0">
          <MetricTile
            label="Total Cars"
            value={stats.totalCars}
            icon={<Car className="h-5 w-5" />}
          />
          <MetricTile
            label="Approved Cars"
            value={stats.activeCars}
            icon={<CheckCircle className="h-5 w-5" />}
            tone="green"
          />
          <MetricTile
            label="Pending Cars"
            value={stats.pendingCars}
            icon={<Clock className="h-5 w-5" />}
            tone="yellow"
          />
          <MetricTile
            label="Rejected Cars"
            value={stats.rejectedCars}
            icon={<XCircle className="h-5 w-5" />}
            tone="red"
          />
          <div className="col-span-2 md:col-span-1 border-t md:border-t-0">
            <MetricTile
              label="Avg Rating"
              value={Number(stats.averageRating.toFixed(1))}
              icon={<Star className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Metrics Row 2: Appointments & Reviews */}
      <section className="border-b border-gray-200 bg-gray-50/30">
        <h3 className="border-b border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 md:px-5">
          Customer Engagement
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-gray-200 [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:md:border-l-0">
          <MetricTile
            label="Total Apt"
            value={stats.totalAppointments}
            icon={<Calendar className="h-5 w-5" />}
          />
          <MetricTile
            label="Pending Apt"
            value={stats.pendingAppointments}
            icon={<Clock className="h-5 w-5" />}
            tone="yellow"
          />
          <MetricTile
            label="Completed Apt"
            value={stats.completedAppointments}
            icon={<CheckCircle className="h-5 w-5" />}
            tone="green"
          />
          <MetricTile
            label="Canceled Apt"
            value={stats.cancelledAppointments}
            icon={<XCircle className="h-5 w-5" />}
            tone="red"
          />
          <div className="col-span-2 md:col-span-1 border-t md:border-t-0">
            <MetricTile
              label="Total Reviews"
              value={stats.totalReviews}
              icon={<MessageSquare className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="border-b border-gray-200 p-3 md:p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Performance Overview
            </h3>
            <p className="text-sm text-gray-500">Sales vs Visits this year</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
              />
              <Bar
                dataKey="sales"
                name="Sales"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="visits"
                name="Visits"
                fill="#93C5FD"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tables Row */}
      <section className="grid divide-y divide-gray-200 border-b border-gray-200 xl:grid-cols-2 xl:divide-x xl:divide-y-0 xl:divide-gray-200">
        <DataPanel
          title="Recent Cars"
          subtitle="Latest listed vehicles"
          actionHref="?tab=car-management"
          actionLabel="Open Management"
        >
          {recentCars.length === 0 ? (
            <EmptySection
              message="No cars listed yet"
              description="Get started by adding your first vehicle to the platform to start receiving test drive requests."
              actionLabel="Add Vehicle"
              actionHref="/profile/dealer/cars/add?step=1"
              icon={<Car className="h-6 w-6" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2.5">Vehicle</th>
                    <th className="px-3 py-2.5">Year</th>
                    <th className="px-3 py-2.5 text-right">Price</th>
                    <th className="px-3 py-2.5 text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCars.map((car, index) => (
                    <tr
                      key={car.id || index}
                      className="group border-b border-gray-200 transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-3 py-2.5 font-medium text-gray-900">
                        {car.make} {car.model}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{car.year}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-gray-900">
                        ฿{car.price?.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 text-right text-gray-600 tabular-nums">
                        <span className="inline-flex items-center justify-end gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                          {car.views || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DataPanel>

        <DataPanel
          title="Recent Appointments"
          subtitle="Latest test-drive activity"
          actionHref="?tab=test-drive-management"
          actionLabel="Open Management"
        >
          {recentAppointments.length === 0 ? (
            <EmptySection
              message="No appointments yet"
              description="When customers schedule a test drive, they'll appear here."
              icon={<Calendar className="h-6 w-6" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2.5">Customer</th>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt, index) => (
                    <tr
                      key={apt.id || index}
                      className="border-b border-gray-200 transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-3 py-2.5 font-medium text-gray-900">
                        {apt.userName || "User"}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 tabular-nums">
                        {new Date(apt.schedule).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className={`inline-flex items-center justify-center border px-2.5 py-1 text-xs font-medium ${getAppointmentStatusColor(
                            apt.status,
                          )}`}
                        >
                          {apt.status?.charAt(0).toUpperCase() +
                            apt.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DataPanel>
      </section>
    </div>
  );
};

const MetricTile = ({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: "default" | "green" | "yellow" | "red";
}) => {
  const toneMap = {
    default: "text-primary-600 bg-primary-50",
    green: "text-green-600 bg-green-50",
    yellow: "text-yellow-600 bg-yellow-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="flex items-center gap-3 bg-white p-3 transition-colors hover:bg-gray-50/50">
      <div className={`rounded-none p-2.5 ${toneMap[tone]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          {value}
        </p>
      </div>
    </div>
  );
};

const DataPanel = ({
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col bg-white">
    <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2.5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
    <div className="p-0">{children}</div>
  </div>
);

const getAppointmentStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "completed":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    case "accepted":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const EmptySection = ({
  message,
  description,
  actionLabel,
  actionHref,
  icon,
}: {
  message: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center  border border-gray-200 bg-gray-50/50 transition-colors hover:bg-gray-50 hover:border-gray-200">
    <div className="mb-3 rounded-none bg-gray-100 p-4 text-gray-400">
      {icon || <Car className="h-6 w-6" />}
    </div>
    <h4 className="text-sm font-semibold text-gray-900">{message}</h4>
    {description && (
      <p className="mt-1 max-w-sm text-xs text-gray-500">{description}</p>
    )}
    {actionLabel && actionHref && (
      <Link
        href={actionHref}
        className="mt-5 inline-flex items-center gap-2 bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        <Plus className="-ml-0.5 h-4 w-4" />
        {actionLabel}
      </Link>
    )}
  </div>
);

const ActionButton = ({
  icon,
  label,
  description,
  href,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  href: string;
}) => (
  <Link
    href={href}
    className="group flex items-center justify-between gap-3 bg-white p-3 transition-all hover:bg-gray-50/50"
  >
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-gray-50 text-gray-600 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
        {icon}
      </span>
      <div>
        <span className="block text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
          {label}
        </span>
        <span className="block text-xs text-gray-500">{description}</span>
      </div>
    </div>
    <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500" />
  </Link>
);

export default Dashboard;
