"use client";

import { AppointmentStatus, IAppointment } from "@/app/types/appointment.types";
import {
  IReview,
  IReviewData,
  IReviewSubmissionDTO,
} from "@/app/types/review.types";
import {
  deleteReview,
  editReview,
  getUserReviews,
  submitReview,
} from "@/utils/API/ReviewAPI";
import {
  AlertTriangle,
  Calendar,
  Car,
  Check,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircleMore,
  Pencil,
  Star,
  StickyNote,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [existingReview, setExistingReview] = useState<IReviewData | null>(
    null,
  );
  const [loadingReview, setLoadingReview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Reusable function to fetch user reviews
  const fetchUserReviews = useCallback(async () => {
    if (mode !== "user" || appointment.status !== "Completed") return;

    setLoadingReview(true);
    try {
      const response: IReview = await getUserReviews();
      if (response.isSuccess && response.data?.items) {
        // Find review for this specific dealer
        const review = response.data.items.find(
          (r) => r.revieweeId === appointment.agentId,
        );
        setExistingReview(review || null);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoadingReview(false);
    }
  }, [mode, appointment.status, appointment.agentId]);

  // Fetch user reviews to check if they've already reviewed this dealer
  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

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

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(appointment.id);
    }
    setShowCancelConfirm(false);
  };

  const handleCloseCancelModal = () => {
    setShowCancelConfirm(false);
  };

  const handleRateClick = () => {
    setShowRatingModal(true);
  };

  const handleEditClick = () => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.reviewText);
      setIsEditMode(true);
      setShowRatingModal(true);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!existingReview) return;

    setDeletingReview(true);
    try {
      const response = await deleteReview(existingReview.id);
      if (response.isSuccess) {
        setShowDeleteConfirm(false);
        setExistingReview(null);
      } else {
        console.error("Failed to delete review:", response.message);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setDeletingReview(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setIsEditMode(false);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please provide a review");
      return;
    }

    setSubmittingReview(true);
    try {
      if (isEditMode && existingReview) {
        // Edit existing review
        const reviewData = {
          rating,
          reviewText: reviewText.trim(),
        };
        const response = await editReview(existingReview.id, reviewData);

        if (response.isSuccess) {
          // Update existing review optimistically before refetch
          setExistingReview({
            ...existingReview,
            rating,
            reviewText: reviewText.trim(),
            updatedAt: new Date().toISOString(),
          });
          handleCloseRatingModal();
          // Refetch to get the actual server state
          await fetchUserReviews();
        } else {
          console.error("Failed to edit review:", response.message);
        }
      } else {
        // Create new review
        const reviewData: IReviewSubmissionDTO = {
          dealerId: appointment.agentId,
          rating,
          reviewText: reviewText.trim(),
        };
        const response = await submitReview(reviewData);

        if (response.isSuccess) {
          handleCloseRatingModal();
          // Refetch to get the newly created review
          await fetchUserReviews();
        } else {
          console.error("Failed to submit review:", response.message);
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleChatClick = () => {
    const userId =
      mode === "dealer" ? appointment.requesterId : appointment.agentId;
    router.push(`/messages?userId=${userId}`);
  };

  const showChatIcon =
    appointment.status === "Pending" ||
    appointment.status === "Confirmed" ||
    appointment.status === "Scheduled";

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

        {/* User View - Cancel Button for Pending/Confirmed/Scheduled */}
        {mode === "user" &&
          (appointment.status === "Pending" ||
            appointment.status === "Confirmed" ||
            appointment.status === "Scheduled") &&
          onCancel && (
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button
                onClick={handleCancelClick}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                {loading ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          )}

        {/* User View - Rate Dealer Button or Existing Review for Completed */}
        {mode === "user" && appointment.status === "Completed" && (
          <div className="mt-4 pt-4 border-t">
            {loadingReview ? (
              <div className="flex items-center gap-2 py-4 px-4 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600 font-medium">
                  Loading review status...
                </span>
              </div>
            ) : existingReview ? (
              // Show existing review
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">
                      You reviewed this dealer
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={handleEditClick}
                      className="ml-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                      title="Edit review"
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "{existingReview.reviewText}"
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Reviewed on{" "}
                  {new Date(existingReview.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              // Show Rate Dealer button
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Appointment completed. Share your experience!</span>
                </div>
                <button
                  onClick={handleRateClick}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:shadow-md"
                >
                  <Star className="h-4 w-4" />
                  Rate Dealer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cancel Appointment?
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Are you sure you want to cancel this appointment with{" "}
                  <span className="font-medium text-gray-900">
                    {appointment.carTitle}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end mt-6">
              <button
                onClick={handleCloseCancelModal}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 transform transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isEditMode ? "Edit Your Review" : "Rate Your Experience"}
                </h3>
                <p className="text-sm text-gray-600">
                  Share your experience with{" "}
                  <span className="font-medium text-gray-900">
                    {appointment.agentName}
                  </span>
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={submittingReview}
                    className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {rating} {rating === 1 ? "star" : "stars"}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share details of your experience with this dealer..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                rows={4}
                disabled={submittingReview}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCloseRatingModal}
                disabled={submittingReview}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || rating === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <Star className="h-4 w-4" />
                {submittingReview
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : isEditMode
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Review?
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Are you sure you want to delete your review for{" "}
                  <span className="font-medium text-gray-900">
                    {appointment.agentName}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end mt-6">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deletingReview}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingReview}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deletingReview ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
