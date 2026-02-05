"use client";

import { CarItems } from "@/app/types/car.types";
import { IKycSubmissions } from "@/app/types/kyc.types";
import { CursorBaseDTO } from "@/app/types/post.types";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Car,
  CheckCircle,
  Clock,
  FileCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface DashboardData {
  kyc: (Omit<CursorBaseDTO, "items"> & { items: IKycSubmissions[] }) | null;
  cars: (Omit<CursorBaseDTO, "items"> & { items: CarItems[] }) | null;
}

interface AdminDashboardProps {
  dashboardData: DashboardData;
}

const AdminDashboard = ({ dashboardData }: AdminDashboardProps) => {
  const { kyc, cars } = dashboardData;

  // Calculate real statistics
  const stats = useMemo(() => {
    const kycItems = kyc?.items || [];
    const carItems = cars?.items || [];

    const pendingKyc = kycItems.filter((k) => k.status === "Pending").length;
    const approvedKyc = kycItems.filter((k) => k.status === "Approved").length;
    const rejectedKyc = kycItems.filter((k) => k.status === "Rejected").length;

    const approvedCars = carItems.filter(
      (c) => c.carValidationStatus?.toLowerCase() === "approved",
    ).length;
    const pendingCars = carItems.filter(
      (c) => c.carValidationStatus?.toLowerCase() === "pending",
    ).length;
    const rejectedCars = carItems.filter(
      (c) => c.carValidationStatus?.toLowerCase() === "rejected",
    ).length;

    // Count unique dealers (users who have cars)
    const uniqueDealers = new Set(
      carItems.map((c) => c.dealerId).filter(Boolean),
    ).size;

    return {
      totalUsers: kycItems.length,
      pendingKyc,
      approvedKyc,
      rejectedKyc,
      totalVehicles: carItems.length,
      approvedCars,
      pendingCars,
      rejectedCars,
      activeDealers: uniqueDealers,
    };
  }, [kyc, cars]);

  // Get recent KYC submissions (last 5)
  const recentKycActivity = useMemo(() => {
    if (!kyc?.items) return [];
    return [...kyc.items]
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )
      .slice(0, 5);
  }, [kyc]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60)
      return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Users className="h-6 w-6" />}
            title="Total KYC Submissions"
            value={stats.totalUsers.toString()}
            change="+12%"
            trend="up"
            color="blue"
          />
          <StatsCard
            icon={<FileCheck className="h-6 w-6" />}
            title="Pending KYC"
            value={stats.pendingKyc.toString()}
            change="-8%"
            trend="down"
            color="orange"
          />
          <StatsCard
            icon={<Car className="h-6 w-6" />}
            title="Total Vehicles"
            value={stats.totalVehicles.toString()}
            change="+23%"
            trend="up"
            color="green"
          />
          <StatsCard
            icon={<Activity className="h-6 w-6" />}
            title="Active Dealers"
            value={stats.activeDealers.toString()}
            change="+5%"
            trend="up"
            color="purple"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <QuickActionButton
                  icon={<FileCheck className="h-5 w-5" />}
                  label="Review KYC Submissions"
                  count={stats.pendingKyc}
                  href="?tab=kyc-verification"
                  color="orange"
                />
                <QuickActionButton
                  icon={<Users className="h-5 w-5" />}
                  label="Verify Dealers"
                  count={0}
                  href="?tab=dealer-verification"
                  color="blue"
                />
                <QuickActionButton
                  icon={<BarChart3 className="h-5 w-5" />}
                  label="Generate Reports"
                  count={0}
                  href="?tab=generate-report"
                  color="green"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentKycActivity.length > 0 ? (
                  recentKycActivity.map((kycItem) => {
                    const statusConfig = {
                      Approved: {
                        icon: (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ),
                        title: "KYC Approved",
                      },
                      Pending: {
                        icon: <Clock className="h-5 w-5 text-orange-600" />,
                        title: "New KYC Submission",
                      },
                      Rejected: {
                        icon: <XCircle className="h-5 w-5 text-red-600" />,
                        title: "KYC Rejected",
                      },
                    };
                    const config = statusConfig[kycItem.status];
                    return (
                      <ActivityItem
                        key={kycItem.id}
                        icon={config.icon}
                        title={config.title}
                        description={`${kycItem.fullName}'s ${kycItem.documentType} verification`}
                        time={getTimeAgo(kycItem.submittedAt)}
                      />
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            System Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <OverviewCard
              title="Verification Status"
              items={[
                {
                  label: "Approved",
                  value: stats.approvedKyc.toString(),
                  color: "green",
                },
                {
                  label: "Pending",
                  value: stats.pendingKyc.toString(),
                  color: "orange",
                },
                {
                  label: "Rejected",
                  value: stats.rejectedKyc.toString(),
                  color: "red",
                },
              ]}
            />
            <OverviewCard
              title="Vehicle Status"
              items={[
                {
                  label: "Approved",
                  value: stats.approvedCars.toString(),
                  color: "green",
                },
                {
                  label: "Pending",
                  value: stats.pendingCars.toString(),
                  color: "orange",
                },
                {
                  label: "Rejected",
                  value: stats.rejectedCars.toString(),
                  color: "red",
                },
              ]}
            />
            <OverviewCard
              title="Platform Stats"
              items={[
                {
                  label: "Total Dealers",
                  value: stats.activeDealers.toString(),
                  color: "blue",
                },
                {
                  label: "Total KYC",
                  value: stats.totalUsers.toString(),
                  color: "purple",
                },
                {
                  label: "Total Cars",
                  value: stats.totalVehicles.toString(),
                  color: "green",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: "blue" | "orange" | "green" | "purple";
}

const StatsCard = ({
  icon,
  title,
  value,
  change,
  trend,
  color,
}: StatsCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="group rounded-2xl bg-white p-6 shadow-sm hover:shadow-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div
          className={`rounded-xl p-3 ${colorClasses[color]} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"
            }`}
        >
          <TrendingUp
            className={`h-4 w-4 ${trend === "down" ? "rotate-180" : ""
              } transition-transform`}
          />
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  href: string;
  color: "orange" | "blue" | "green";
}

const QuickActionButton = ({
  icon,
  label,
  count,
  href,
  color,
}: QuickActionButtonProps) => {
  const colorClasses = {
    orange: "bg-orange-50 hover:bg-orange-100 text-orange-600",
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600",
    green: "bg-green-50 hover:bg-green-100 text-green-600",
  };

  return (
    <Link href={href}>
      <button
        className={`group flex w-full items-center justify-between rounded-xl p-4 transition-all duration-200 ${colorClasses[color]}`}
      >
        <div className="flex items-center gap-3">
          <div className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </div>
          <span className="font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold">
              {count}
            </span>
          )}
          <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </button>
    </Link>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({
  icon,
  title,
  description,
  time,
}: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50">
      <div className="rounded-lg bg-gray-100 p-2">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
};

interface OverviewCardProps {
  title: string;
  items: Array<{ label: string; value: string; color: string }>;
}

const OverviewCard = ({ title, items }: OverviewCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <h3 className="mb-4 font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className={`font-bold text-${item.color}-600`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
