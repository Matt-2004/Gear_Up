import { CarDetailDTO } from "../../car/types/car.dto";
import { CarDetailModel } from "../../car/types/car.model";
import { carDetailMapper } from "../../car/types/car.mapper";
import { PostDTO } from "./post.dto";
import { PostModel } from "./post.model";

function safeCarDetail(dto: unknown): CarDetailModel | null {
  if (!dto || typeof dto !== "object") return null;
  const c = dto as Record<string, unknown>;
  if (!c.id || !c.name || !c.dealerId) return null;
  try {
    return carDetailMapper(dto as CarDetailDTO);
  } catch {
    return null;
  }
}

export function PostMapper(dto: PostDTO): PostModel {
  return {
    id: dto.id,
    caption: dto.caption,
    content: dto.content,
    authorUsername: dto.authorUsername,
    authorProfileImage: dto.authorAvatarUrl,
    visibility: dto.visibility,
    carDto: safeCarDetail(dto.carDto),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    likeCount: dto.likeCount,
    isLikedByCurrentUser: dto.isLikedByCurrentUser,
    commentCount: dto.commentCount,
    viewCount: dto.viewCount,
  };
}
