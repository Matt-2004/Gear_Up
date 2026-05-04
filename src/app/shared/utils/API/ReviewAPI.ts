import {
  IReviewSubmissionDTO,
  ReviewResponse,
} from "@/app/features/review/types/review.dto";
import { deleteFetch, getFetch, putFetch, postFetch } from "./AxiosClient";

export async function submitReview(reviewData: IReviewSubmissionDTO) {
  return postFetch("/api/v1/reviews", reviewData);
}

export async function editReview(
  reviewId: string,
  reviewData: Omit<IReviewSubmissionDTO, "dealerId">,
) {
  return putFetch(`/api/reviews/${reviewId}`, reviewData);
}

export async function deleteReview(reviewId: string) {
  return deleteFetch(`/api/reviews/${reviewId}`);
}

export async function getReviewsByReviewId(reviewId: string) {
  return getFetch<ReviewResponse>(`/api/v1/reviews/${reviewId}`);
}

export async function getReviewsByDealerId(dealerId: string) {
  return getFetch<ReviewResponse>(`/api/v1/reviews/dealer/${dealerId}`);
}

export async function getReviewByDealerIdWithSummary(dealerId: string) {
  return getFetch<ReviewResponse>(`/api/v1/reviews/dealer/${dealerId}/summary`);
}

export async function getUserReviews() {
  return getFetch<ReviewResponse>("/api/v1/reviews/my");
}
