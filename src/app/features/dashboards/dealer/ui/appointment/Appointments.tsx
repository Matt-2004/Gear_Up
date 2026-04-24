"use client";

import {
  AppointmentStatus,
  AppointmentData,
} from "@/app/features/appointments/types/appointment.types";
import {
  acceptAppointmentById,
  cancelAppointmentById,
  completeAppointmentById,
  rejectAppointmentById,
} from "@/app/shared/utils/API/AppointmentAPI";
import { useState } from "react";
import AppointmentCard from "./AppointmentCard";
import AppointmentEmptyState from "@/app/features/appointments/ui/appointment-card/AppointmentEmptyState";
import FilterDropdown from "@/app/features/appointments/ui/dashboard/FilterDropdown";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

interface AppointmentsProps {
  appointments: CursorResponse<AppointmentData[]>;
}

const Appointments = ({
  appointments: initialAppointments,
}: AppointmentsProps) => {
  const [appointments, setAppointments] = useState<
    CursorResponse<AppointmentData[]>
  >(initialAppointments || { items: [] });
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
  const [loading, setLoading] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredAppointments =
    filter === "All"
      ? appointments.items
      : appointments.items.filter((apt) => apt.status === filter);

  const appointmentCounts = {
    total: appointments.items.length,
    pending: appointments.items.filter((a) => a.status === "Pending").length,
    confirmed: appointments.items.filter((a) => a.status === "Scheduled")
      .length,
    completed: appointments.items.filter((a) => a.status === "Completed")
      .length,
    cancelled: appointments.items.filter((a) => a.status === "Cancelled")
      .length,
    rejected: appointments.items.filter((a) => a.status === "Rejected").length,
  };

  const handleAccept = async (appointmentId: string) => {
    setLoading(appointmentId);

    try {
      await acceptAppointmentById(appointmentId);
      setAppointments((prev) => ({
        ...prev,
        items: prev.items.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Scheduled" } : apt,
        ),
      }));
    } catch (error) {
      console.error("Failed to accept appointment:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (
    appointmentId: string,
    rejectionReason: string,
  ) => {
    setLoading(appointmentId);

    try {
      const result = await rejectAppointmentById(appointmentId, {
        rejectionReason,
      });
      setAppointments((prev) => ({
        ...prev,
        items: prev.items.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Rejected" } : apt,
        ),
      }));
      alert("Appointment rejected successfully");
    } catch (error: any) {
      console.error("Failed to reject appointment:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleComplete = async (appointmentId: string) => {
    setLoading(appointmentId);
    try {
      await completeAppointmentById(appointmentId);
      setAppointments((prev) => ({
        ...prev,
        items: prev.items.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Completed" } : apt,
        ),
      }));
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setLoading(appointmentId);
    try {
      await cancelAppointmentById(appointmentId);
      setAppointments((prev) => ({
        ...prev,
        items: prev.items.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt,
        ),
      }));
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Appointment Management
            </h1>
            <p className="text-gray-600">
              Manage your customer appointments and test drive schedules
            </p>
          </div>

          {/* Filter Dropdown */}
          <FilterDropdown
            filter={filter}
            dropdownOpen={dropdownOpen}
            appointmentCounts={appointmentCounts}
            onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
            onFilterChange={(newFilter) => {
              setFilter(newFilter);
              setDropdownOpen(false);
            }}
          />
        </div>

        {/* Appointments List */}
        <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
          {(filteredAppointments || []).length === 0 ? (
            <div className="col-span-full">
              <AppointmentEmptyState filter={filter} mode="dealer" />
            </div>
          ) : (
            (filteredAppointments || []).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                loading={loading === appointment.id}
                onAccept={handleAccept}
                onReject={handleReject}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
