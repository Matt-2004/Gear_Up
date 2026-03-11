import { IReviewSubmissionDTO } from "@/types/review.types";
import { apiFetch, apiDelete, apiPost, apiPut } from "./AxiosClientBrowser";

export async function submitReview(reviewData: IReviewSubmissionDTO) {
  return apiPost("/api/reviews", reviewData);
}

export async function editReview(
  reviewId: string,
  reviewData: Omit<IReviewSubmissionDTO, "dealerId">,
) {
  return apiPut(`/api/reviews/${reviewId}`, reviewData);
}

export async function deleteReview(reviewId: string) {
  return apiDelete(`/api/reviews/${reviewId}`);
}

export async function getReviewsByReviewId(reviewId: string) {
  return apiFetch(`/api/reviews/${reviewId}`);
}

export async function getReviewsByDealerId(dealerId: string) {
  return apiFetch(`/api/reviews/dealers/${dealerId}`);
}

export async function getReviewByDealerIdWithSummary(dealerId: string) {
  return apiFetch(`/api/reviews/dealers/${dealerId}/summary`);
}

export async function getUserReviews() {
  return apiFetch("/api/reviews/my");
}
