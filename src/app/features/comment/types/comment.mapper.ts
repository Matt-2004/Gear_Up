import { CommentDTO } from "./comment.dto";
import { CommentModel } from "./comment.model";

export function CommentMapper(dto: CommentDTO): CommentModel {
  return {
    id: dto.id,
    postId: dto.postId,
    commentedUserId: dto.commentedUserId,
    commentedUserName: dto.commentedUserName,
    likeCount: dto.likeCount,
    isLikedByCurrentUser: dto.isLikedByCurrentUser,
    isEdited: dto.isEdited,
    commentedUserProfilePictureUrl: dto.commentedUserProfilePictureUrl,
    childCount: dto.childCount,
    content: dto.content,
    parentCommentId: dto.parentCommentId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
