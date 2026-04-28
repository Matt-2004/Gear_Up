"use client";

import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import {
  AppointmentFilterStatus,
  AppointmentData,
  AppointmentResponse,
} from "@/app/features/appointments/types/appointment.types";
import SharedAppointmentCard from "@/app/features/appointments/ui/appointment-card/RoleBasedAppointmentCard";
import AppointmentEmptyState from "@/app/features/appointments/ui/appointment-card/AppointmentEmptyState";
import AppointmentFilterDropdown from "@/app/features/appointments/ui/dashboard/AppointmentFilterDropdown";
import {
  acceptAppointmentById,
  cancelAppointmentById,
  rejectAppointmentById,
} from "@/app/shared/utils/API/AppointmentAPI";
import { getStatusColor } from "@/app/features/appointments/utils/appointmentUtils";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import StatsCard, {
  StatsCardProps,
} from "@/app/features/dashboards/dealer/ui/dealer-management/StatsCard";

type AppointmentCounts = {
  total: number;
  pending: number;
  scheduled: number;
  cancelled: number;
  completed: number;
  rejected: number;
};

const emptyAppointmentData: CursorResponse<AppointmentData[]> = {
  items: [],
  nextCursor: null,
  hasMore: false,
};

const StatsRow = ({ counts }: { counts: AppointmentCounts }) => {
  const stats: StatsCardProps[] = [
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
      category: "Appointment",
    },
    {
      label: "Confirmed",
      value: counts.scheduled,
      variant: "green",
      description: "Confirmed appointments with customers",
      category: "Appointment",
    },
    {
      label: "Declined",
      value: counts.cancelled + counts.rejected,
      variant: "red",
      description: "Requests that were cancelled or rejected",
      category: "Appointment",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          description={stat.description}
          variant={stat.variant}
          category={stat.category}
        />
      ))}
    </div>
  );
};

const AppointmentManagement = ({
  appointmentData,
}: {
  appointmentData: AppointmentResponse;
}) => {
  const [data, setData] = useState<CursorResponse<AppointmentData[]>>(
    appointmentData?.data ?? emptyAppointmentData,
  );

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppointmentFilterStatus>("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const appointments = data.items ?? [];

  const counts = useMemo<AppointmentCounts>(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "Pending").length,
      scheduled: appointments.filter((a) => a.status === "Scheduled").length,
      cancelled: appointments.filter((a) => a.status === "Cancelled").length,
      completed: appointments.filter((a) => a.status === "Completed").length,
      rejected: appointments.filter((a) => a.status === "Rejected").length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (filter === "All") {
      return appointments;
    }

    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  const handleAccept = async (id: string) => {
    setActionLoading(id);

    try {
      await acceptAppointmentById(id);

      setData((prev) => ({
        ...prev,
        items: prev.items.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "Scheduled" }
            : appointment,
        ),
      }));
    } catch (error) {
      console.error("Failed to accept appointment:", error);
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
        items: prev.items.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "Rejected" }
            : appointment,
        ),
      }));
    } catch (error) {
      console.error("Failed to reject appointment:", error);
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
        items: prev.items.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "Cancelled" }
            : appointment,
        ),
      }));
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
            <AppointmentFilterDropdown
              filter={filter}
              dropdownOpen={dropdownOpen}
              appointmentCounts={counts}
              onToggleDropdown={() => setDropdownOpen((open) => !open)}
              onFilterChange={(nextFilter) => {
                setFilter(nextFilter);
                setDropdownOpen(false);
              }}
            />
          </div>
        </div>

        <StatsRow counts={counts} />

        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <AppointmentEmptyState filter={filter} mode="dealer" />
          ) : (
            filteredAppointments.map((appointment) => (
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
      </div>
    </div>
  );
};

export default AppointmentManagement;
