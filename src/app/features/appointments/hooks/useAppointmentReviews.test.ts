import { renderHook, act, waitFor } from "@testing-library/react";
import { useAppointmentReviews } from "./useAppointmentReviews";
import {
  deleteReview,
  editReview,
  getUserReviews,
  submitReview,
} from "@/app/shared/utils/API/ReviewAPI";

jest.mock("@/app/shared/utils/API/ReviewAPI", () => ({
  deleteReview: jest.fn(),
  editReview: jest.fn(),
  getUserReviews: jest.fn(),
  submitReview: jest.fn(),
}));

const mockedGetUserReviews = getUserReviews as jest.Mock;
const mockedSubmitReview = submitReview as jest.Mock;
const mockedEditReview = editReview as jest.Mock;
const mockedDeleteReview = deleteReview as jest.Mock;

function setup(mode: "user" | "dealer" = "user", status = "Completed") {
  return renderHook(() =>
    useAppointmentReviews({
      mode,
      status: status as never,
      agentId: "agent-1",
    }),
  );
}

describe("useAppointmentReviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    // Use dealer mode to avoid triggering fetchUserReviews on mount
    it("initializes with all modal and state defaults", () => {
      const { result } = setup("dealer", "Pending");
      expect(result.current.existingReview).toBeNull();
      expect(result.current.loadingReview).toBe(false);
      expect(result.current.showRatingModal).toBe(false);
      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.rating).toBe(0);
      expect(result.current.hoverRating).toBe(0);
      expect(result.current.reviewText).toBe("");
      expect(result.current.isEditMode).toBe(false);
    });
  });

  describe("fetching reviews", () => {
    it("fetches reviews on mount for user mode with Completed status", async () => {
      mockedGetUserReviews.mockResolvedValue({
        isSuccess: true,
        data: { items: [] },
      });
      const { result } = setup("user", "Completed");
      await waitFor(() => {
        expect(result.current.loadingReview).toBe(false);
      });
      expect(mockedGetUserReviews).toHaveBeenCalled();
    });

    it("skips fetch in dealer mode", async () => {
      const { result } = setup("dealer", "Completed");
      await waitFor(() => {
        expect(result.current.loadingReview).toBe(false);
      });
      expect(mockedGetUserReviews).not.toHaveBeenCalled();
    });

    it("sets existingReview when user has already reviewed this agent", async () => {
      mockedGetUserReviews.mockResolvedValue({
        isSuccess: true,
        data: {
          items: [
            {
              id: "review-1",
              revieweeId: "agent-1",
              rating: 4,
              reviewText: "Great dealer",
            },
          ],
        },
      });
      const { result } = setup("user", "Completed");
      await waitFor(() => {
        expect(result.current.existingReview).not.toBeNull();
      });
      expect(result.current.existingReview?.rating).toBe(4);
    });
  });

  describe("submit review", () => {
    it("alerts when rating is 0", async () => {
      window.alert = jest.fn();
      const { result } = setup();
      act(() => {
        result.current.handleRateClick();
      });
      act(() => {
        result.current.setReviewText("Good experience");
      });
      await act(async () => {
        await result.current.handleSubmitReview();
      });
      expect(window.alert).toHaveBeenCalledWith("Please select a rating");
    });

    it("submits review successfully", async () => {
      window.alert = jest.fn();
      mockedSubmitReview.mockResolvedValue({ isSuccess: true });
      mockedGetUserReviews.mockResolvedValue({
        isSuccess: true,
        data: { items: [] },
      });
      const { result } = setup("user", "Completed");
      await waitFor(() => expect(result.current.loadingReview).toBe(false));
      act(() => {
        result.current.handleRateClick();
        result.current.setRating(5);
        result.current.setReviewText("Excellent dealer");
      });
      await act(async () => {
        await result.current.handleSubmitReview();
      });
      expect(mockedSubmitReview).toHaveBeenCalledWith({
        dealerId: "agent-1",
        rating: 5,
        reviewText: "Excellent dealer",
      });
      expect(result.current.showRatingModal).toBe(false);
    });

    it("edits an existing review", async () => {
      mockedGetUserReviews.mockResolvedValue({
        isSuccess: true,
        data: {
          items: [
            {
              id: "review-1",
              revieweeId: "agent-1",
              rating: 3,
              reviewText: "Okay",
            },
          ],
        },
      });
      mockedEditReview.mockResolvedValue({ isSuccess: true });
      const { result } = setup("user", "Completed");
      await waitFor(() => expect(result.current.existingReview).not.toBeNull());
      act(() => {
        result.current.handleEditClick();
      });
      expect(result.current.isEditMode).toBe(true);
      expect(result.current.rating).toBe(3);
      act(() => {
        result.current.setRating(4);
        result.current.setReviewText("Better than expected");
      });
      await act(async () => {
        await result.current.handleSubmitReview();
      });
      expect(mockedEditReview).toHaveBeenCalledWith("review-1", {
        rating: 4,
        reviewText: "Better than expected",
      });
    });
  });

  describe("delete review", () => {
    it("confirms deletion and removes review", async () => {
      mockedGetUserReviews.mockResolvedValue({
        isSuccess: true,
        data: {
          items: [
            {
              id: "review-1",
              revieweeId: "agent-1",
              rating: 4,
              reviewText: "Good",
            },
          ],
        },
      });
      mockedDeleteReview.mockResolvedValue({});
      const { result } = setup("user", "Completed");
      await waitFor(() => expect(result.current.existingReview).not.toBeNull());
      act(() => {
        result.current.handleDeleteClick();
      });
      expect(result.current.showDeleteConfirm).toBe(true);
      await act(async () => {
        await result.current.handleConfirmDelete();
      });
      expect(mockedDeleteReview).toHaveBeenCalledWith("review-1");
      expect(result.current.existingReview).toBeNull();
      expect(result.current.showDeleteConfirm).toBe(false);
    });
  });

  describe("modal close", () => {
    it("resets rating modal state on close", async () => {
      const { result } = setup("user", "Pending");
      act(() => {
        result.current.handleRateClick();
        result.current.setRating(3);
        result.current.setReviewText("test");
      });
      act(() => {
        result.current.handleCloseRatingModal();
      });
      expect(result.current.showRatingModal).toBe(false);
      expect(result.current.rating).toBe(0);
      expect(result.current.reviewText).toBe("");
      expect(result.current.isEditMode).toBe(false);
    });
  });
});
