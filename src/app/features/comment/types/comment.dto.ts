export interface CommentResponse {
  isSuccess: boolean;
  data: CommentDTO[];
  successMessage: string;
  errorMessage: string;
  status: number;
}

export interface CommentDTO {
  id: string;
  postId: string;
  commentedUserId: string;
  commentedUserName: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  isEdited: boolean;
  commentedUserProfilePictureUrl: string;
  childCount: number;
  content: string;
  parentCommentId: any;
  createdAt: string;
  updatedAt: string;
}

export interface AddCommentDTO {
  postId: string;
  text: string;
  parentCommentId: string | null;
}
