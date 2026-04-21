import { DefaultResponse } from "./default-response.types";

export interface IReviewSubmissionDTO {
  dealerId: string;
  rating: number;
  reviewText: string;
}

export interface ReviewResponse extends DefaultResponse<IReviewCursor> {}

export interface IReviewCursor {
  items: IReviewData[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface IReviewData {
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

export interface IReviewSummary extends DefaultResponse<IReviewSummaryData> {}

export interface IReviewSummaryData {
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
