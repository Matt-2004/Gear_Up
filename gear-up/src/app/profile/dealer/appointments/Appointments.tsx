"use client";

import { AppointmentStatus, IAppointment } from "@/app/types/appointment.types";
import {
  acceptAppointmentById,
  cancelAppointmentById,
  completeAppointmentById,
  rejectAppointmentById,
} from "@/utils/API/AppointmentAPI";
import {
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  StickyNote,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface AppointmentsProps {
  appointments: IAppointment[];
}

const Appointments = ({
  appointments: initialAppointments,
}: AppointmentsProps) => {
  const [appointments, setAppointments] =
    useState<IAppointment[]>(initialAppointments);
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
  const [loading, setLoading] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  const handleAccept = async (appointmentId: string) => {
    setLoading(appointmentId);
    try {
      await acceptAppointmentById(appointmentId);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Confirmed" } : apt,
        ),
      );
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
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Rejected" } : apt,
        ),
      );
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
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "Completed" } : apt,
        ),
      );
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    } finally {
      setLoading(null);
    }
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

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
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
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 shadow-sm"
            >
              <Filter className="h-4 w-4" />
              {filter === "All" ? "All Appointments" : filter}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 z-30 w-56 rounded-md bg-white shadow-sm shadow-gray-300 border border-gray-200">
                  <ul className="p-1">
                    {[
                      {
                        label: "All",
                        status: "All" as const,
                        count: appointments.length,
                      },
                      {
                        label: "Pending",
                        status: "Pending" as const,
                        count: appointments.filter(
                          (apt) => apt.status === "Pending",
                        ).length,
                      },
                      {
                        label: "Confirmed",
                        status: "Confirmed" as const,
                        count: appointments.filter(
                          (apt) => apt.status === "Confirmed",
                        ).length,
                      },
                      {
                        label: "Completed",
                        status: "Completed" as const,
                        count: appointments.filter(
                          (apt) => apt.status === "Completed",
                        ).length,
                      },
                      {
                        label: "Cancelled",
                        status: "Cancelled" as const,
                        count: appointments.filter(
                          (apt) => apt.status === "Cancelled",
                        ).length,
                      },
                      {
                        label: "Rejected",
                        status: "Rejected" as const,
                        count: appointments.filter(
                          (apt) => apt.status === "Rejected",
                        ).length,
                      },
                    ].map(({ label, status, count }) => (
                      <li key={status}>
                        <button
                          onClick={() => {
                            setFilter(status);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 rounded-sm px-3 py-2 hover:bg-green-100 hover:border-green-200 transition-colors text-left ${filter === status
                              ? "bg-green-50 text-primary"
                              : "text-gray-700"
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            {status === "Pending" && (
                              <Clock className="h-4 w-4" />
                            )}
                            {status === "Confirmed" && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            {status === "Completed" && (
                              <Check className="h-4 w-4" />
                            )}
                            {status === "Cancelled" && (
                              <X className="h-4 w-4" />
                            )}
                            {status === "Rejected" && (
                              <XCircle className="h-4 w-4" />
                            )}
                            {status === "All" && <Filter className="h-4 w-4" />}
                            {label}
                          </span>
                          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
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
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600">
              {filter === "All"
                ? "You don't have any appointments yet."
                : `No ${filter.toLowerCase()} appointments at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {appointment.carTitle}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Customer Info */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Customer Details
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">
                          {appointment.requesterName}
                        </span>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Appointment Details
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {formatDate(appointment.schedule)}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <StickyNote className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">
                            Customer Notes
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    {appointment.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(appointment.id)}
                          disabled={loading === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(appointment.id)}
                          disabled={loading === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                    {appointment.status === "Confirmed" && (
                      <>
                        <button
                          onClick={() => handleComplete(appointment.id)}
                          disabled={loading === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          Mark Complete
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          disabled={loading === appointment.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
