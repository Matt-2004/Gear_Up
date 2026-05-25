export interface CarImagesModel {
  url: string;
  carId: string;
}

export interface PostModel {
  id: string;
  caption: string;
  content: string;
  authorUsername: string;
  authorProfileImage: string;
  visibility: string;
  carId: string;
  carImages: CarImagesModel[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  viewCount: number;
}
