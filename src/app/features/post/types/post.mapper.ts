import { carDetailMapper, carMapper } from "../../car/types/car.mapper";
import { PostDTO } from "./post.dto";
import { PostModel } from "./post.model";

export function PostMapper(dto: PostDTO): PostModel {
  return {
    id: dto.id,
    caption: dto.caption,
    content: dto.content,
    authorUsername: dto.authorUsername,
    authorProfileImage: dto.authorAvatarUrl,
    visibility: dto.visibility,
    carDto: carDetailMapper(dto.carDto),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    likeCount: dto.likeCount,
    isLikedByCurrentUser: dto.isLikedByCurrentUser,
    commentCount: dto.commentCount,
    viewCount: dto.viewCount,
  };
}
