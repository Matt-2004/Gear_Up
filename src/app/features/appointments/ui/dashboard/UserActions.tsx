import { CheckCircle, Pencil, Star, Trash2, XCircle } from "lucide-react";
import { IReviewData } from "@/app/features/review/types/review.types";
import { AppointmentStatus } from "@/app/features/appointments/types/appointment.types";

interface UserActionsProps {
  status: AppointmentStatus;
  loading: boolean;
  onCancel?: () => void;
  loadingReview: boolean;
  existingReview: IReviewData | null;
  handleRateClick: () => void;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
}

export const UserActions = ({
  status,
  loading,
  onCancel,
  loadingReview,
  existingReview,
  handleRateClick,
  handleEditClick,
  handleDeleteClick,
}: UserActionsProps) => {
  const showCancelButton = status === "Pending" || status === "Scheduled";

  if (showCancelButton && onCancel) {
    return (
      <div className="flex justify-end gap-2 w-full mt-2 sm:mt-0">
        <button
          onClick={() => onCancel()}
          disabled={loading}
          className="flex flex-1 sm:flex-none justify-center items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          {loading ? "Cancelling..." : "Cancel Appointment"}
        </button>
      </div>
    );
  }

  if (status === "Completed") {
    return (
      <div className="w-full border-t border-gray-100 sm:border-t-0 sm:pt-0 pt-4 mt-2 sm:mt-0">
        {loadingReview ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <span className="text-sm font-medium text-gray-600">
              Loading review status...
            </span>
          </div>
        ) : existingReview ? (
          <div className="rounded-lg bg-linear-to-r from-blue-50 to-purple-50 p-4">
            <div className="mb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">
                  You reviewed this dealer
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= existingReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex">
                  <button
                    onClick={handleEditClick}
                    className="ml-2 rounded-lg p-1.5 transition-colors hover:bg-white/50"
                    title="Edit review"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="rounded-lg p-1.5 transition-colors hover:bg-white/50"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic mt-2">
              &quot;{existingReview.reviewText}&quot;
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Reviewed on{" "}
              {new Date(existingReview.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              <span>Appointment completed. Share your experience!</span>
            </div>
            <button
              onClick={handleRateClick}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-md"
            >
              <Star className="h-4 w-4" />
              Rate Dealer
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};
