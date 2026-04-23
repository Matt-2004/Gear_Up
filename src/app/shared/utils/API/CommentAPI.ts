import { AddComment } from "@/app/features/comment/types/comment.types";
import { deleteFetch, getFetch, postFetch, putFetch } from "./AxiosClient";

export async function getCommentsByPostId(postId: string) {
  return getFetch(`/api/comments/${postId}/top`);
}

export async function getNestedCommentsByCommentId(parentCommentId: string) {
  return getFetch(`/api/comments/${parentCommentId}/children`);
}

export async function addComment(data: AddComment) {
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
