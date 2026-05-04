import { IReviewSummaryDTO, ReviewDTO } from "./review.dto";
import { ReviewModel, ReviewSummaryModel } from "./review.model";

export function ReviewMapper(dto: ReviewDTO): ReviewModel {
  return {
    id: dto.id,
    reviewerId: dto.reviewerId,
    reviewerName: dto.reviewerName,
    reviewerAvatarUrl: dto.reviewerAvatarUrl,
    revieweeId: dto.revieweeId,
    revieweeName: dto.revieweeName,
    reviewText: dto.reviewText,
    rating: dto.rating,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function ReviewSummaryMapper(
  dto: IReviewSummaryDTO,
): ReviewSummaryModel {
  return {
    dealerId: dto.dealerId,
    dealerName: dto.dealerName,
    averageRating: dto.averageRating,
    totalReviews: dto.totalReviews,
    fiveStarCount: dto.fiveStarCount,
    fourStarCount: dto.fourStarCount,
    threeStarCount: dto.threeStarCount,
    twoStarCount: dto.twoStarCount,
    oneStarCount: dto.oneStarCount,
  };
}
