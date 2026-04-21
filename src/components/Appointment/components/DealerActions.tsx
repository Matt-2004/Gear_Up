import { Check, CheckCircle, X, XCircle } from "lucide-react";
import { AppointmentStatus } from "@/types/appointment.types";

interface DealerActionsProps {
  status: AppointmentStatus;
  loading: boolean;
  appointmentId: string;
  showRejectInput: boolean;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  setShowRejectInput: (show: boolean) => void;
  onAccept?: (appointmentId: string) => void;
  onReject?: (appointmentId: string, reason: string) => void;
  onComplete?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  handleReject: () => void;
}

export const DealerActions = ({
  status,
  loading,
  appointmentId,
  showRejectInput,
  rejectionReason,
  setRejectionReason,
  setShowRejectInput,
  onAccept,
  onComplete,
  onCancel,
  handleReject,
}: DealerActionsProps) => {
  if (status === "Pending") {
    return (
      <div className="flex flex-col gap-3">
        {showRejectInput && (
          <div className="mb-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this appointment..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
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
              className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            {loading
              ? "Processing..."
              : showRejectInput
                ? "Confirm Reject"
                : "Reject"}
          </button>
          {onAccept && (
            <button
              onClick={() => onAccept(appointmentId)}
              disabled={loading || showRejectInput}
              className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" />
              {loading ? "Processing..." : "Accept"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === "Scheduled") {
    return (
      <div className="flex justify-end gap-2 w-full">
        {onCancel && (
          <button
            onClick={() => onCancel(appointmentId)}
            disabled={loading}
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            {loading ? "Processing..." : "Cancel"}
          </button>
        )}
        {onComplete && (
          <button
            onClick={() => onComplete(appointmentId)}
            disabled={loading}
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {loading ? "Processing..." : "Mark Complete"}
          </button>
        )}
      </div>
    );
  }

  return null;
};
