import { CarDetailModel } from "../../car/types/car.model";

export interface PostModel {
  id: string;
  caption: string;
  content: string;
  authorUsername: string;
  authorProfileImage: string;
  visibility: string;
  carDto: CarDetailModel | null;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  viewCount: number;
}
