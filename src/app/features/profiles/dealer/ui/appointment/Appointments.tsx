"use client";

import {
  acceptAppointmentById,
  cancelAppointmentById,
  completeAppointmentById,
  rejectAppointmentById,
} from "@/app/shared/utils/API/AppointmentAPI";
import { useState } from "react";
import AppointmentCard from "./AppointmentCard";
import AppointmentEmptyState from "@/app/features/appointments/ui/appointment-card/AppointmentEmptyState";
import AppointmentFilterDropdown from "@/app/features/appointments/ui/dashboard/AppointmentFilterDropdown";
import ConfirmModal from "@/app/shared/ui/ConfirmModal";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { AppointmentFilterStatus } from "@/app/features/appointments/types/appointment.dto";
import { AppointmentModel } from "@/app/features/appointments/types/appointment.model";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";

interface AppointmentsProps {
  appointments: CursorResponse<AppointmentModel[]>;
}

const Appointments = ({
  appointments: initialAppointments,
}: AppointmentsProps) => {
  const { addToastMessage } = useToast();
  const [appointments, setAppointments] = useState<
    CursorResponse<AppointmentModel[]>
  >(initialAppointments || { items: [] });
  const [filter, setFilter] = useState<AppointmentFilterStatus>("All");
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

      addToastMessage(
        "success",
        result.message || "Appointment rejected successfully",
      );
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      addToastMessage("error", err.message || "Failed to reject appointment");
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

  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const handleCancel = (appointmentId: string) => {
    setCancelTarget(appointmentId);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const appointmentId = cancelTarget;
    setLoading(appointmentId);
    setCancelTarget(null);
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
          <AppointmentFilterDropdown
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
      <ConfirmModal
        open={cancelTarget !== null}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmLabel="Yes, Cancel"
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}

export default Appointments;
