import { IReviewSubmissionDTO } from "@/app/types/review.types";
import { deleteFetch, getFetch, postFetch, putFetch } from "./AxiosClient";

export async function submitReview(reviewData: IReviewSubmissionDTO) {
  const res = await postFetch("/api/v1/reviews", reviewData);
  return res;
}

export async function editReview(
  reviewId: string,
  reviewData: Omit<IReviewSubmissionDTO, "dealerId">,
) {
  const res = await putFetch(`/api/v1/reviews/${reviewId}`, reviewData);
  return res;
}

export async function deleteReview(reviewId: string) {
  const res = await deleteFetch(`/api/v1/reviews/${reviewId}`);
  return res;
}

export async function getReviewsByReviewId(reviewId: string) {
  const res = await getFetch(`/api/v1/reviews/${reviewId}`);
  return res;
}

export async function getReviewsByDealerId(dealerId: string) {
  const res = await getFetch(`/api/v1/reviews/dealers/${dealerId}`);
  return res;
}

export async function getReviewByDealerIdWithSummary(dealerId: string) {
  const res = await getFetch(`/api/v1/reviews/dealers/${dealerId}/summary`);
  return res;
}

export async function getUserReviews() {
  const res = await getFetch("/api/v1/reviews/my");
  return res;
}
