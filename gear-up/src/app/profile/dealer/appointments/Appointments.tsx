"use client";

import { AppointmentStatus, IAppointment } from "@/app/types/appointment.types";
import { CursorBaseDTO } from "@/app/types/post.types";
import {
  acceptAppointmentById,
  cancelAppointmentById,
  completeAppointmentById,
  rejectAppointmentById,
} from "@/utils/API/AppointmentAPI";
import { useState } from "react";
import AppointmentCard from "./components/AppointmentCard";
import EmptyState from "./components/EmptyState";
import FilterDropdown from "./components/FilterDropdown";
import StatsCard from "./components/StatsCard";

interface AppointmentsProps {
  appointments: Omit<CursorBaseDTO, "items"> & { items: IAppointment[] };
}

const Appointments = ({
  appointments: initialAppointments,
}: AppointmentsProps) => {
  const [appointments, setAppointments] = useState<
    Omit<CursorBaseDTO, "items"> & { items: IAppointment[] }
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
    confirmed: appointments.items.filter((a) => a.status === "Confirmed")
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
          apt.id === appointmentId ? { ...apt, status: "Confirmed" } : apt,
        ),
      }));
    } catch (error) {
      console.error("Failed to accept appointment:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (appointmentId: string) => {
    setLoading(appointmentId);
    try {
      await rejectAppointmentById(appointmentId);
      setAppointments((prev) => ({
        ...prev,
        items: prev.items.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Rejected" } : apt,
        ),
      }));
    } catch (error) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
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

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-6">
          <StatsCard label="Total" value={appointmentCounts.total} />
          <StatsCard
            label="Pending"
            value={appointmentCounts.pending}
            variant="yellow"
          />
          <StatsCard
            label="Confirmed"
            value={appointmentCounts.confirmed}
            variant="blue"
          />
          <StatsCard
            label="Completed"
            value={appointmentCounts.completed}
            variant="green"
          />
          <StatsCard
            label="Cancelled"
            value={appointmentCounts.cancelled}
            variant="gray"
          />
          <StatsCard
            label="Rejected"
            value={appointmentCounts.rejected}
            variant="red"
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {(filteredAppointments || []).length === 0 ? (
            <EmptyState filter={filter} />
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
