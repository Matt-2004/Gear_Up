import { Star } from "lucide-react";

export interface RatingModalProps {
  showInfo: boolean;
  isEditMode: boolean;
  agentName: string;
  rating: number;
  hoverRating: number;
  submittingReview: boolean;
  reviewText: string;
  setRating: (rating: number) => void;
  setHoverRating: (rating: number) => void;
  setReviewText: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const RatingModal = ({
  showInfo,
  isEditMode,
  agentName,
  rating,
  hoverRating,
  submittingReview,
  reviewText,
  setRating,
  setHoverRating,
  setReviewText,
  onClose,
  onSubmit,
}: RatingModalProps) => {
  if (!showInfo) return null;

  return (
    <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg transform rounded-xl bg-white p-6 shadow-2xl transition-all">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-purple-100">
            <Star className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Your Review" : "Rate Your Experience"}
            </h3>
            <p className="text-sm text-gray-600">
              Share your experience with{" "}
              <span className="font-medium text-gray-900">{agentName}</span>
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">
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
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share details of your experience with this dealer..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            rows={4}
            disabled={submittingReview}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submittingReview}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submittingReview || rating === 0}
            className="flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
  );
};
