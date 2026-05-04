import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";

export interface IReviewSubmissionDTO {
  dealerId: string;
  rating: number;
  reviewText: string;
}

export interface ReviewResponse extends MainResponse<
  CursorResponse<ReviewDTO[]>
> {}

export interface ReviewDTO {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatarUrl: string;
  revieweeId: string;
  revieweeName: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummaryResponse extends MainResponse<IReviewSummaryDTO> {}

export interface IReviewSummaryDTO {
  dealerId: string;
  dealerName: string;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}
