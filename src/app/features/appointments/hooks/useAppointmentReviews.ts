import { useCallback, useEffect, useState } from "react";
import { AppointmentStatus } from "@/app/features/appointments/types/appointment.types";
import {
  ReviewResponse,
  IReviewData,
  IReviewSubmissionDTO,
} from "@/app/features/review/types/review.types";
import {
  deleteReview,
  editReview,
  getUserReviews,
  submitReview,
} from "@/app/shared/utils/API/ReviewAPI";

interface UseAppointmentReviewsProps {
  mode: "user" | "dealer";
  status: AppointmentStatus;
  agentId: string;
}

export const useAppointmentReviews = ({
  mode,
  status,
  agentId,
}: UseAppointmentReviewsProps) => {
  const [existingReview, setExistingReview] = useState<IReviewData | null>(
    null,
  );
  const [loadingReview, setLoadingReview] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Rating form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchUserReviews = useCallback(async () => {
    if (mode !== "user" || status !== "Completed") return;

    setLoadingReview(true);
    try {
      const response: ReviewResponse = await getUserReviews();
      if (response.isSuccess && response.data?.items) {
        const review = response.data.items.find(
          (r: IReviewData) => r.revieweeId === agentId,
        );
        setExistingReview(review || null);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    } finally {
      setLoadingReview(false);
    }
  }, [mode, status, agentId]);

  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

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

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setIsEditMode(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (!existingReview) return;

    setDeletingReview(true);
    try {
      await deleteReview(existingReview.id);

      setShowDeleteConfirm(false);
      setExistingReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setDeletingReview(false);
    }
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
        const reviewData = { rating, reviewText: reviewText.trim() };
        const response = await editReview(existingReview.id, reviewData);

        if (response.isSuccess) {
          setExistingReview({
            ...existingReview,
            rating,
            reviewText: reviewText.trim(),
            updatedAt: new Date().toISOString(),
          });
          handleCloseRatingModal();
          await fetchUserReviews();
        } else {
          console.error("Failed to edit review:", response.message);
        }
      } else {
        const reviewData: IReviewSubmissionDTO = {
          dealerId: agentId,
          rating,
          reviewText: reviewText.trim(),
        };
        const response = await submitReview(reviewData);

        if (response.isSuccess) {
          handleCloseRatingModal();
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

  return {
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
  };
};
