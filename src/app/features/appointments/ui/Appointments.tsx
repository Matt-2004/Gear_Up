"use client";

import {
  AppointmentResponse,
  AppointmentStatus,
  AppointmentData,
} from "@/types/appointment.types";
import { cancelAppointmentById } from "@/utils/API/AppointmentAPI";
import { useState } from "react";
import AppointmentEmptyState from "@/components/Appointment/AppointmentEmptyState";
import FilterDropdown from "@/components/Appointment/FilterDropdown";
import AppointmentCard from "./AppointmentCard";

interface AppointmentsProps {
  appointments: AppointmentResponse;
}

const Appointments = ({
  appointments: initialAppointments,
}: AppointmentsProps) => {
  const [appointments, setAppointments] = useState<AppointmentData[]>(
    initialAppointments?.data?.items || [],
  );
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
  const [loading, setLoading] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredAppointments =
    filter === "All"
      ? appointments
      : (appointments || []).filter((apt) => apt.status === filter);

  const appointmentCounts = {
    total: (appointments || []).length,
    pending: (appointments || []).filter((a) => a.status === "Pending").length,
    confirmed: (appointments || []).filter((a) => a.status === "Scheduled")
      .length,
    completed: (appointments || []).filter((a) => a.status === "Completed")
      .length,
    cancelled: (appointments || []).filter((a) => a.status === "Cancelled")
      .length,
    rejected: (appointments || []).filter((a) => a.status === "Rejected")
      .length,
  };

  const handleCancel = async (appointmentId: string) => {
    setLoading(appointmentId);
    try {
      await cancelAppointmentById(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
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
              My Appointments
            </h1>
            <p className="text-gray-600">
              View and manage your test drive appointments
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
              <AppointmentEmptyState filter={filter} mode="user" />
            </div>
          ) : (
            (filteredAppointments || []).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                loading={loading === appointment.id}
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
