"use client";

import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import {
  AppointmentStatus,
  AppointmentData,
} from "@/app/features/appointments/types/appointment.types";
import SharedAppointmentCard from "@/app/features/appointments/ui/appointment-card/RoleBasedAppointmentCard";
import {
  acceptAppointmentById,
  cancelAppointmentById,
  dealerAppointments,
  rejectAppointmentById,
} from "@/app/shared/utils/API/AppointmentAPI";
import { getStatusColor } from "@/app/features/appointments/utils/appointmentUtils";
import { Calendar, ChevronDown, Filter, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import StatsCard, {
  StatsCardProps,
} from "@/app/features/dashboards/dealer/ui/dealer-management/StatsCard";
// ─── sub-components ───────────────────────────────────────────────────────────

type AppointmentCounts = {
  total: number;
  pending: number;
  confirmed?: number;
  completed?: number;
  scheduled?: number;
  cancelled: number;
  rejected?: number;
};

const StatsRow = ({ counts }: { counts: AppointmentCounts }) => {
  const statsBase = [
    {
      label: "All Appointments",
      value: counts.total,
      description:
        "View and manage all customer appointments across every status",
      variant: "default",
      category: "Appointment",
    },
    {
      label: "New Requests",
      value: counts.pending,
      variant: "yellow",
      description: "Customers are waiting for your response",
    },
    {
      label: "Confirmed",
      value: counts.scheduled,
      variant: "green",
      description: "Confirmed appointments with customers",
    },
    {
      label: "Declined",
      value: counts.cancelled,
      variant: "red",
      description: "Requests that were not accepted",
    },
  ];

  const stats = statsBase.filter(
    (s) => s.value !== undefined,
  ) as StatsCardProps[];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatsCard
          label={s.label}
          value={s.value}
          description={s.description}
          variant={s.variant}
          category={s.category}
        />
      ))}
    </div>
  );
};

const FilterDropdown = ({
  filter,
  dropdownOpen,
  appointmentCounts,
  onToggleDropdown,
  onFilterChange,
}: {
  filter: AppointmentStatus | "All";
  dropdownOpen: boolean;
  appointmentCounts: AppointmentCounts;
  onToggleDropdown: () => void;
  onFilterChange: (f: AppointmentStatus | "All") => void;
}) => {
  const statusOptionsBase = [
    {
      label: "All Appointments",
      status: "All" as const,
      count: appointmentCounts.total,
    },
    {
      label: "New Requests",
      status: "Pending" as const,
      count: appointmentCounts.pending,
    },
    {
      label: "Confirmed",
      status: "Scheduled" as const,
      count: appointmentCounts.scheduled,
    },
    {
      label: "Declined",
      status: "Rejected" as const,
      count: appointmentCounts.rejected,
    },
  ];

  const statusOptions = statusOptionsBase.filter(
    (opt) => opt.count !== undefined,
  ) as { label: string; status: AppointmentStatus | "All"; count: number }[];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggleDropdown}
        className="focus:ring-primary-500 flex items-center gap-2 rounded-lg  bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:outline-none"
      >
        <Filter className="h-4 w-4" />
        {filter === "All" ? "All Status" : filter}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={onToggleDropdown} />
          <div className="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
            <ul className="p-1">
              {statusOptions.map(({ label, status, count }) => (
                <li key={status}>
                  <button
                    type="button"
                    onClick={() => onFilterChange(status)}
                    className={`flex items-center justify-between w-full gap-2 px-3 py-2 text-left text-sm transition-colors rounded-md hover:bg-primary-50 hover:text-primary-700 ${
                      filter === status
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                        filter === status
                          ? "bg-primary-100 text-primary-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

const EmptyState = ({ filter }: { filter: AppointmentStatus | "All" }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
    <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
    <h3 className="mb-2 text-lg font-medium text-gray-900">
      No appointments found
    </h3>
    <p className="text-gray-500">
      {filter === "All"
        ? "You don't have any appointments yet."
        : `No ${filter.toLowerCase()} appointments at the moment.`}
    </p>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────

const AppointmentManagement = () => {
  const [data, setData] = useState<CursorResponse<AppointmentData[]>>({
    items: [],
    nextCursor: null,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await dealerAppointments();
      setData(res?.data ?? { items: [], nextCursor: null, hasMore: false });
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { errorMessage?: string } };
        message?: string;
      };
      setFetchError(
        errorResponse?.response?.data?.errorMessage ??
          errorResponse?.message ??
          "Failed to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── action handlers ──────────────────────────────────────────────────────

  const handleAccept = async (id: string) => {
    setActionLoading(id);
    try {
      await acceptAppointmentById(id);
      setData((prev) => ({
        ...prev,
        items: prev.items.map((a) =>
          a.id === id ? { ...a, status: "Scheduled" } : a,
        ),
      }));
    } catch (err) {
      console.error("Failed to accept appointment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, rejectionReason: string) => {
    setActionLoading(id);
    try {
      await rejectAppointmentById(id, { rejectionReason });
      setData((prev) => ({
        ...prev,
        items: prev.items.map((a) =>
          a.id === id ? { ...a, status: "Rejected" } : a,
        ),
      }));
    } catch (err) {
      console.error("Failed to reject appointment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      await cancelAppointmentById(id);
      setData((prev) => ({
        ...prev,
        items: prev.items.map((a) =>
          a.id === id ? { ...a, status: "Cancelled" } : a,
        ),
      }));
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── derived ──────────────────────────────────────────────────────────────

  const counts: AppointmentCounts = {
    total: data.items.length,
    pending: data.items.filter((a) => a.status === "Pending").length,
    scheduled: data.items.filter((a) => a.status === "Scheduled").length,
    cancelled: data.items.filter((a) => a.status === "Cancelled").length,
    completed: data.items.filter((a) => a.status === "Completed").length,
    rejected: data.items.filter((a) => a.status === "Rejected").length,
  };

  const filtered =
    filter === "All"
      ? data.items
      : data.items.filter((a) => a.status === filter);

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div className=" bg-linear-to-br min-h-screen max-h-full  from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Test Drive Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer test-drive appointments and schedules
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <RotateCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <FilterDropdown
              filter={filter}
              dropdownOpen={dropdownOpen}
              appointmentCounts={counts}
              onToggleDropdown={() => setDropdownOpen((o) => !o)}
              onFilterChange={(f) => {
                setFilter(f);
                setDropdownOpen(false);
              }}
            />
          </div>
        </div>

        {/* stats */}
        {!loading && !fetchError && <StatsRow counts={counts} />}

        {/* loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <RotateCcw className="mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm">Loading appointments…</p>
          </div>
        )}

        {/* error */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
            <p className="mb-4 text-sm font-medium text-red-600">
              {fetchError}
            </p>
            <button
              type="button"
              onClick={fetchData}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {/* list */}
        {!loading && !fetchError && (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              filtered.map((appointment) => (
                <SharedAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  loading={actionLoading === appointment.id}
                  mode="dealer"
                  getStatusColor={getStatusColor}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onCancel={handleCancel}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
