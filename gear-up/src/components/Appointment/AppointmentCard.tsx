"use client";

import { AppointmentStatus, IAppointment } from "@/app/types/appointment.types";
import {
  Calendar,
  Car,
  Check,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircleMore,
  StickyNote,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AppointmentCardProps {
  appointment: IAppointment;
  loading: boolean;
  mode: "user" | "dealer";
  formatDate: (date: string) => string;
  getStatusColor: (status: AppointmentStatus) => string;
  onAccept?: (appointmentId: string) => void;
  onReject?: (appointmentId: string, rejectionReason: string) => void;
  onComplete?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
}

const AppointmentCard = ({
  appointment,
  loading,
  mode,
  formatDate,
  getStatusColor,
  onAccept,
  onReject,
  onComplete,
  onCancel,
}: AppointmentCardProps) => {
  const router = useRouter();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    if (!onReject) return;

    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    onReject(appointment.id, rejectionReason);
    setShowRejectInput(false);
    setRejectionReason("");
  };

  const handleChatClick = () => {
    const userId =
      mode === "dealer" ? appointment.requesterId : appointment.agentId;
    router.push(`/messages?userId=${userId}`);
  };

  const showChatIcon =
    appointment.status === "Pending" || appointment.status === "Confirmed";

  const contactPersonLabel = mode === "dealer" ? "Customer" : "Dealer";
  const contactPersonName =
    mode === "dealer" ? appointment.requesterName : appointment.agentName;
  const notesLabel = mode === "dealer" ? "Customer Notes" : "Notes";

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.carTitle}
            </h3>
            <p className="text-sm text-gray-600">
              Appointment ID: {appointment.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showChatIcon && (
            <button
              onClick={handleChatClick}
              className="rounded-full p-2 hover:bg-blue-50 transition-colors"
              title={`Chat with ${contactPersonLabel.toLowerCase()}`}
            >
              <MessageCircleMore className="h-5 w-5 text-primary-500" />
            </button>
          )}
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
              appointment.status,
            )}`}
          >
            {appointment.status}
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Scheduled Date</p>
            <p className="text-sm text-gray-600">
              {formatDate(appointment.schedule)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Location</p>
            <p className="text-sm text-gray-600">{appointment.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <User className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {contactPersonLabel}
            </p>
            <p className="text-sm text-gray-600">{contactPersonName}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Created</p>
            <p className="text-sm text-gray-600">
              {formatDate(appointment.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {appointment.notes && (
        <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <StickyNote className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">{notesLabel}</p>
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="">
        {/* Dealer View - Pending Status */}
        {mode === "dealer" && appointment.status === "Pending" && (
          <>
            {showRejectInput && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this appointment..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  rows={3}
                  disabled={loading}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              {showRejectInput && (
                <button
                  onClick={() => {
                    setShowRejectInput(false);
                    setRejectionReason("");
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
              {onReject && (
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {loading
                    ? "Processing..."
                    : showRejectInput
                      ? "Confirm Reject"
                      : "Reject"}
                </button>
              )}
              {onAccept && (
                <button
                  onClick={() => onAccept(appointment.id)}
                  disabled={loading || showRejectInput}
                  className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  {loading ? "Processing..." : "Accept"}
                </button>
              )}
            </div>
          </>
        )}

        {/* Dealer View - Confirmed Status */}
        {mode === "dealer" && appointment.status === "Confirmed" && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <button
                onClick={() => onCancel(appointment.id)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                {loading ? "Processing..." : "Cancel"}
              </button>
            )}
            {onComplete && (
              <button
                onClick={() => onComplete(appointment.id)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {loading ? "Processing..." : "Mark Complete"}
              </button>
            )}
          </div>
        )}

        {/* User View - Cancel Button for Pending/Confirmed */}
        {mode === "user" &&
          (appointment.status === "Pending" ||
            appointment.status === "Confirmed") &&
          onCancel && (
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button
                onClick={() => onCancel(appointment.id)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                {loading ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default AppointmentCard;
