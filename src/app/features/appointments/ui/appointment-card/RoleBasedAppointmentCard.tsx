"use client";

import { MessageSquareText } from "lucide-react";
import { AppointmentDateColumn } from "../dashboard/AppointmentDateColumn";
import { AppointmentHeader } from "../dashboard/AppointmentHeader";
import { AppointmentDetailsGrid } from "../dashboard/AppointmentDetailsGrid";
import { AppointmentNotes } from "../dashboard/AppointmentNotes";
import { CancelModal } from "../dashboard/CancelModal";
import { RatingModal } from "../dashboard/RatingModal";
import { DeleteReviewModal } from "../dashboard/DeleteReviewModal";
import { DealerActions } from "../dashboard/DealerActions";
import { UserActions } from "../dashboard/UserActions";
import { useAppointmentReviews } from "../../hooks/useAppointmentReviews";
import { useAppointmentActions } from "../../hooks/useAppointmentActions";
import { AppointmentStatus } from "../../types/appointment.dto";
import { AppointmentModel } from "../../types/appointment.model";

interface AppointmentCardProps {
  appointment: AppointmentModel;
  loading: boolean;
  mode: "user" | "dealer";
  getStatusColor: (status: AppointmentStatus) => string;
  onAccept?: (appointmentId: string) => void;
  onReject?: (appointmentId: string, rejectionReason: string) => void;
  onComplete?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
}

const RoleBasedAppointmentCard = ({
  appointment,
  loading,
  mode,
  getStatusColor,
  onAccept,
  onReject,
  onComplete,
  onCancel,
}: AppointmentCardProps) => {
  const {
    existingReview,
    loadingReview,
    showRatingModal,
    showDeleteConfirm,
    deletingReview,
    submittingReview,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    reviewText,
    setReviewText,
    isEditMode,
    handleRateClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseRatingModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleSubmitReview,
  } = useAppointmentReviews({
    mode,
    status: appointment.status,
    agentId: appointment.agentId,
  });

  const {
    showRejectInput,
    setShowRejectInput,
    rejectionReason,
    setRejectionReason,
    showCancelConfirm,
    handleReject,
    handleCancelClick,
    handleConfirmCancel,
    handleCloseCancelModal,
    handleChatClick,
  } = useAppointmentActions({
    appointmentId: appointment.id,
    mode,
    agentId: appointment.agentId,
    requesterId: appointment.requesterId,
    onReject,
    onCancel,
  });

  const showChatIcon = appointment.status === "Scheduled";

  const contactPersonLabel = mode === "dealer" ? "Customer" : "Dealer";
  const contactPersonName =
    mode === "dealer" ? appointment.requesterName : appointment.agentName;
  const notesLabel = mode === "dealer" ? "Customer Notes" : "Notes";

  // Parse schedule for visual calendar view
  const scheduleDateObj = new Date(appointment.schedule);
  const scheduleMonth = scheduleDateObj.toLocaleString("default", {
    month: "short",
  });
  const scheduleDay = scheduleDateObj.getDate();
  const scheduleYear = scheduleDateObj.getFullYear();
  const scheduleTime = scheduleDateObj.toLocaleTimeString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="group flex h-full flex-col sm:flex-row overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.15)]">
      {/* Left Column - Date and Time Hub */}
      <AppointmentDateColumn
        scheduleMonth={scheduleMonth}
        scheduleDay={scheduleDay}
        scheduleYear={scheduleYear}
        scheduleTime={scheduleTime}
      />

      {/* Right Column - Information & Actions */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Header section: Title, ID, Status, Chat */}
        <AppointmentHeader
          carTitle={appointment.carTitle}
          id={appointment.id}
          status={appointment.status}
          getStatusColor={getStatusColor}
        />

        {/* Info Grid */}
        <AppointmentDetailsGrid
          location={appointment.location}
          contactPersonLabel={contactPersonLabel}
          contactPersonName={contactPersonName}
        />

        {/* Notes Block */}
        <AppointmentNotes notes={appointment.notes} notesLabel={notesLabel} />

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end sm:items-center gap-4">
          {/* Left Side: Call to Action (Chat) */}
          <div className="w-full sm:w-auto">
            {showChatIcon && (
              <button
                onClick={handleChatClick}
                className="flex items-center justify-center cursor-pointer gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus:ring-offset-1 w-full sm:w-auto"
                title={`Chat with ${contactPersonLabel.toLowerCase()}`}
              >
                <MessageSquareText className="h-4 w-4" />
                Message {contactPersonLabel}
              </button>
            )}
          </div>

          {/* Right Side Actions Container */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            {mode === "dealer" ? (
              <DealerActions
                status={appointment.status}
                loading={loading}
                appointmentId={appointment.id}
                showRejectInput={showRejectInput}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                setShowRejectInput={setShowRejectInput}
                onAccept={onAccept}
                onReject={onReject}
                onComplete={onComplete}
                onCancel={onCancel}
                handleReject={handleReject}
              />
            ) : (
              <UserActions
                status={appointment.status}
                loading={loading}
                onCancel={handleCancelClick}
                loadingReview={loadingReview}
                existingReview={existingReview}
                handleRateClick={handleRateClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelModal
        showInfo={showCancelConfirm}
        carTitle={appointment.carTitle}
        loading={loading}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />

      {/* Rating Modal */}
      <RatingModal
        showInfo={showRatingModal}
        isEditMode={isEditMode}
        agentName={appointment.agentName}
        rating={rating}
        hoverRating={hoverRating}
        submittingReview={submittingReview}
        reviewText={reviewText}
        setRating={setRating}
        setHoverRating={setHoverRating}
        setReviewText={setReviewText}
        onClose={handleCloseRatingModal}
        onSubmit={handleSubmitReview}
      />

      {/* Delete Confirmation Modal */}
      <DeleteReviewModal
        showInfo={showDeleteConfirm}
        agentName={appointment.agentName}
        deletingReview={deletingReview}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RoleBasedAppointmentCard;
