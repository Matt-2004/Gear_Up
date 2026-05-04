import {
  CommentResponse,
  AddCommentDTO,
} from "@/app/features/comment/types/comment.dto";
import { deleteFetch, getFetch, postFetch, putFetch } from "./AxiosClient";

export async function getCommentsByPostId(postId: string) {
  return getFetch<CommentResponse>(`/api/comments/${postId}/top`);
}

export async function getNestedCommentsByCommentId(parentCommentId: string) {
  return getFetch<CommentResponse>(`/api/comments/${parentCommentId}/children`);
}

export async function addComment(data: AddCommentDTO) {
  return postFetch("/api/comments", data);
}

export async function addLikeToComment(commentId: string) {
  return postFetch(`/api/comments/${commentId}/like`, null);
}

export async function updateCommentById(commentId: string, content: string) {
  return putFetch(`/api/comments/${commentId}`, content);
}

export async function deleteCommentById(commentId: string) {
  return deleteFetch(`/api/comments/${commentId}`);
}
