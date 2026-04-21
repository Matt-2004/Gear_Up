import { CreatePostData } from "@/types/post.types";
import { deleteFetch, getFetch, putFetch, postFetch } from "./AxiosClient";

export async function getAllPosts(cursor?: string) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  const url = query.toString()
    ? `/api/v1/posts?${query.toString()}`
    : "/api/v1/posts";
  return getFetch(url);
}

export async function createPost(data: CreatePostData) {
  return postFetch("/api/v1/posts", data);
}

export async function getPostById(postId: string) {
  return getFetch(`/api/v1/posts/${postId}`);
}

export async function deletePostById(postId: string) {
  return deleteFetch(`/api/v1/posts/${postId}`);
}

export async function updatePostById(
  postId: string,
  data: Omit<CreatePostData, "carId">,
) {
  return putFetch(`/api/v1/posts/${postId}`, data);
}

export async function myPost(cursor?: string) {
  const url = cursor ? `/api/v1/posts/me?cursor=${cursor}` : "/api/v1/posts/me";
  return getFetch(url);
}

export async function deletePostLike(postId: string) {
  return deleteFetch(`/api/v1/posts/${postId}/like`);
}

export async function getUserPostLikes(postId: string) {
  return getFetch(`/api/v1/posts/${postId}/like`);
}

export async function addUserPostLikes(postId: string) {
  return postFetch(`/api/v1/posts/${postId}/like`, null);
}
