import { AddComment } from "@/types/comment.types";
import { apiFetch, apiDelete, apiPost, apiPut } from "./AxiosClientBrowser";

export async function getCommentsByPostId(postId: string) {
  return apiFetch(`/api/comments/${postId}/top`);
}

export async function getNestedCommentsByCommentId(parentCommentId: string) {
  return apiFetch(`/api/comments/${parentCommentId}/children`);
}

export async function addComment(data: AddComment) {
  return apiPost("/api/comments", data);
}

export async function addLikeToComment(commentId: string) {
  return apiPost(`/api/comments/${commentId}/like`, null);
}

export async function updateCommentById(commentId: string, content: string) {
  return apiPut(`/api/comments/${commentId}`, content);
}

export async function deleteCommentById(commentId: string) {
  return apiDelete(`/api/comments/${commentId}`);
}
