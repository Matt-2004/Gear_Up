import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CarDetailDTO, CarDTO } from "../../car/types/car.dto";

export interface PostResponse {
  isSuccess: boolean;
  data: CursorResponse<PostDTO[]>;
  successMessage: string;
  errorMessage: string;
  status: number;
}

export interface PostDTO {
  id: string;
  caption: string;
  content: string;
  authorUsername: string;
  authorAvatarUrl: string;
  visibility: string;
  carDto: CarDetailDTO;
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
