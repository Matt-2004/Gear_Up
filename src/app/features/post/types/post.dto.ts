import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

export interface PostResponse {
  isSuccess: boolean;
  data: CursorResponse<PostDTO[]>;
  successMessage: string;
  errorMessage: string;
  status: number;
}

interface CarImagesDTO {
  id: string;
  carId: string;
  url: string;
  status: string;
  errorMessage: null;
}

export interface PostDTO {
  id: string;
  caption: string;
  content: string;
  authorUsername: string;
  authorAvatarUrl: string;
  visibility: string;
  carId: string;
  carImages: CarImagesDTO[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  commentCount: number;
  viewCount: number;
}

export interface CreatePostDTO {
  caption: string;
  content: string;
  visibility: "Default" | "Public" | "Private";
  carId: string;
}
