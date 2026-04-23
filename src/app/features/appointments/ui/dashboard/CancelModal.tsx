import { AlertTriangle, XCircle } from "lucide-react";

export interface CancelModalProps {
  showInfo: boolean;
  carTitle: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelModal = ({
  showInfo,
  carTitle,
  loading,
  onClose,
  onConfirm,
}: CancelModalProps) => {
  if (!showInfo) return null;

  return (
    <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Cancel Appointment?
            </h3>
            <p className="mb-1 text-sm text-gray-600">
              Are you sure you want to cancel this appointment with{" "}
              <span className="font-medium text-gray-900">{carTitle}</span>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};
