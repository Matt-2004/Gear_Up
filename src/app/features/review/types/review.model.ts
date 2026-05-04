export interface ReviewModel {
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

export interface ReviewSummaryModel {
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
