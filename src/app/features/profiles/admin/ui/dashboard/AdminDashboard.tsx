"use client";

import { CarModel } from "@/app/features/car/types/car.model";
import StatsCard from "../../../dealer/ui/dealer-management/StatsCard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  FileCheck,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { KycModel } from "../../../dealer/types/kyc.model";

interface DashboardData {
  kyc: CursorResponse<KycModel[]>;
  cars: CursorResponse<CarModel[]>;
}

interface AdminDashboardProps {
  dashboardData: DashboardData;
}

const AdminDashboard = ({ dashboardData }: AdminDashboardProps) => {
  const { kyc, cars } = dashboardData;
  const [clientNow, setClientNow] = useState<Date | null>(null);

  useEffect(() => {
    setClientNow(new Date());
  }, []);

  // Calculate real statistics
  const stats = useMemo(() => {
    const kycItems = kyc?.items || [];
    const carItems = cars?.items || [];

    const pendingKyc = kycItems.filter((k) => k.status === "Pending").length;
    const approvedKyc = kycItems.filter((k) => k.status === "Approved").length;
    const rejectedKyc = kycItems.filter((k) => k.status === "Rejected").length;

    const approvedCars = carItems.filter(
      (c) => c.status?.toLowerCase() === "approved",
    ).length;
    const pendingCars = carItems.filter(
      (c) => c.status?.toLowerCase() === "pending",
    ).length;
    const rejectedCars = carItems.filter(
      (c) => c.status?.toLowerCase() === "rejected",
    ).length;

    // Count unique dealers (users who have cars)
    const uniqueDealers = new Set(carItems.map((c) => c.id).filter(Boolean))
      .size;

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

  const getTimeAgo = (dateString: string, now: Date | null) => {
    if (!now) return "";
    const date = new Date(dateString);
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Verification Status</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="All KYC"
              value={stats.totalUsers}
              variant="default"
              description=""
              category="KYC"
            />
            <StatsCard
              label="Pending KYC"
              value={stats.pendingKyc}
              variant="yellow"
              description=""
            />
            <StatsCard
              label="Approved KYC"
              value={stats.approvedKyc}
              variant="green"
              description=""
            />
            <StatsCard
              label="Rejected KYC"
              value={stats.rejectedKyc}
              variant="red"
              description=""
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text font-semibold text-gray-900">Vehicle Status</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="All Cars"
              value={stats.totalVehicles}
              variant="default"
              description=""
            />
            <StatsCard
              label="Pending Cars"
              value={stats.pendingCars}
              variant="yellow"
              description=""
            />
            <StatsCard
              label="Approved Cars"
              value={stats.approvedCars}
              variant="green"
              description=""
            />
            <StatsCard
              label="Rejected Cars"
              value={stats.rejectedCars}
              variant="red"
              description=""
            />
          </div>
        </div>
        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className=" bg-white p-6 h-full shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Quick Actions
              </h2>
              <div className="flex flex-col gap-4">
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
                  href="?tab=car-verification"
                  color="blue"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className=" bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
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
                        key={kycItem.kycId}
                        icon={config.icon}
                        title={config.title}
                        description={`${kycItem.name}'s ${kycItem.documentType} verification`}
                        time={getTimeAgo(kycItem.submittedAt, clientNow)}
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
        <div className=" bg-white p-6 shadow-sm">
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
  return (
    <Link href={href}>
      <button
        className={`group flex w-full hover:text-primary border border-primary items-center justify-between  p-4 transition-all duration-200`}
      >
        <div className="flex items-center gap-3">
          <div className="transition-transform duration-200 ">{icon}</div>
          <span className="font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5" />
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
    <div className="flex items-start gap-4 p-3 transition-colors hover:bg-[#E8E9E0] cursor-pointer">
      <div className="rounded-lg bg-gray-100 p-2">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 hover:text-primary">
          {title}
        </p>
        <p className="text-sm text-gray-600 ">{description}</p>
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
    <div className="border border-gray-200 p-4">
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
