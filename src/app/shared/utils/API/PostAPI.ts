import { deleteFetch, getFetch, putFetch, postFetch } from "./AxiosClient";
import { MainResponse } from "../../types.ts/main-response";
import {
  CreatePostDTO,
  PostDTO,
  PostResponse,
} from "@/app/features/post/types/post.dto";

export async function getAllPosts(cursor?: string) {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  const url = query.toString()
    ? `/api/v1/posts?${query.toString()}`
    : "/api/v1/posts";
  return getFetch<PostResponse>(url);
}

export async function createPost(data: CreatePostDTO) {
  return postFetch<null>("/api/v1/posts", data);
}

export async function getPostById(postId: string) {
  return getFetch<MainResponse<PostDTO>>(`/api/v1/posts/${postId}`);
}

export async function deletePostById(postId: string) {
  return deleteFetch(`/api/v1/posts/${postId}`);
}

export async function updatePostById(
  postId: string,
  data: Omit<CreatePostDTO, "carId">,
) {
  return putFetch(`/api/v1/posts/${postId}`, data);
}

export async function myPost(cursor?: string) {
  const url = cursor ? `/api/v1/posts/me?cursor=${cursor}` : "/api/v1/posts/me";
  return getFetch<PostResponse>(url);
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
