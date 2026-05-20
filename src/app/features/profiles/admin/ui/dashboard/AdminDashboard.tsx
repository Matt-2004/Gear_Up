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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Verification Stats */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Verification Status
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="All KYC"
              value={stats.totalUsers}
              variant="default"
              description="Total submissions"
              category="KYC"
            />
            <StatsCard
              label="Pending KYC"
              value={stats.pendingKyc}
              variant="yellow"
              description="Awaiting review"
            />
            <StatsCard
              label="Approved KYC"
              value={stats.approvedKyc}
              variant="green"
              description="Verified dealers"
            />
            <StatsCard
              label="Rejected KYC"
              value={stats.rejectedKyc}
              variant="red"
              description="Declined"
            />
          </div>
        </section>

        {/* Vehicle Stats */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Vehicle Status
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="All Cars"
              value={stats.totalVehicles}
              variant="default"
              description="Total listings"
            />
            <StatsCard
              label="Pending Cars"
              value={stats.pendingCars}
              variant="yellow"
              description="Awaiting review"
            />
            <StatsCard
              label="Approved Cars"
              value={stats.approvedCars}
              variant="green"
              description="Live on platform"
            />
            <StatsCard
              label="Rejected Cars"
              value={stats.rejectedCars}
              variant="red"
              description="Declined"
            />
          </div>
        </section>

        {/* Quick Actions + Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="?tab=kyc-verification">
                  <button className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-primary-200 hover:bg-primary-50/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                        <FileCheck className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Review KYC Submissions
                        </p>
                        {stats.pendingKyc > 0 && (
                          <p className="text-xs text-amber-600">
                            {stats.pendingKyc} pending
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </Link>

                <Link href="?tab=car-verification">
                  <button className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-primary-200 hover:bg-primary-50/50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Verify Car Listings
                        </p>
                        {stats.pendingCars > 0 && (
                          <p className="text-xs text-blue-600">
                            {stats.pendingCars} pending
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              {recentKycActivity.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {recentKycActivity.map((kycItem) => {
                    const statusConfig = {
                      Approved: {
                        icon: (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                        ),
                        title: "KYC Approved",
                      },
                      Pending: {
                        icon: (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                            <Clock className="h-4 w-4 text-amber-600" />
                          </div>
                        ),
                        title: "New KYC Submission",
                      },
                      Rejected: {
                        icon: (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                            <XCircle className="h-4 w-4 text-rose-600" />
                          </div>
                        ),
                        title: "KYC Rejected",
                      },
                    };
                    const config = statusConfig[kycItem.status];
                    return (
                      <div
                        key={kycItem.kycId}
                        className="flex items-center gap-4 px-1 py-3 transition-colors hover:bg-gray-50/50"
                      >
                        {config.icon}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {config.title}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {kycItem.name}&apos;s {kycItem.documentType}{" "}
                            verification
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-400">
                          {getTimeAgo(kycItem.submittedAt, clientNow)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">
            System Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <OverviewCard
              title="Verification Status"
              items={[
                {
                  label: "Approved",
                  value: stats.approvedKyc.toString(),
                  color: "emerald",
                },
                {
                  label: "Pending",
                  value: stats.pendingKyc.toString(),
                  color: "amber",
                },
                {
                  label: "Rejected",
                  value: stats.rejectedKyc.toString(),
                  color: "rose",
                },
              ]}
            />
            <OverviewCard
              title="Vehicle Status"
              items={[
                {
                  label: "Approved",
                  value: stats.approvedCars.toString(),
                  color: "emerald",
                },
                {
                  label: "Pending",
                  value: stats.pendingCars.toString(),
                  color: "amber",
                },
                {
                  label: "Rejected",
                  value: stats.rejectedCars.toString(),
                  color: "rose",
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
                  color: "emerald",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverviewCardProps {
  title: string;
  items: Array<{ label: string; value: string; color: string }>;
}

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

const OverviewCard = ({ title, items }: OverviewCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2 w-2 rounded-full ${colorMap[item.color] ?? "bg-gray-400"}`}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
