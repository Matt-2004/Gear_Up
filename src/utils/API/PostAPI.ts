import { apiFetch, apiDelete, apiPost, apiPut } from "./AxiosClientBrowser";
import { CreatePostData } from "@/types/post.types";

export async function getAllPosts(cursor?: string) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  const url = query.toString()
    ? `/api/posts?${query.toString()}`
    : "/api/posts";
  return apiFetch(url);
}

export async function createPost(data: CreatePostData) {
  return apiPost("/api/posts", data);
}

export async function getPostById(postId: string) {
  return apiFetch(`/api/posts/${postId}`);
}

export async function deletePostById(postId: string) {
  return apiDelete(`/api/posts/${postId}`);
}

export async function updatePostById(
  postId: string,
  data: Omit<CreatePostData, "carId">,
) {
  return apiPut(`/api/posts/${postId}`, data);
}

export async function myPost(cursor?: string) {
  const url = cursor ? `/api/posts/me?cursor=${cursor}` : "/api/posts/me";
  return apiFetch(url);
}

export async function deletePostLike(postId: string) {
  return apiDelete(`/api/posts/${postId}/like`);
}

export async function getUserPostLikes(postId: string) {
  return apiFetch(`/api/posts/${postId}/like`);
}

export async function addUserPostLikes(postId: string) {
  return apiPost(`/api/posts/${postId}/like`, null);
}
