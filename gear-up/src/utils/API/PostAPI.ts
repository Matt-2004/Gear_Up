import { CreatePostData } from "@/app/types/post.types"
import { deleteFetch, getFetch, postFetch, putFetch } from "./AxiosClient"

export async function getAllPosts(cursor?: string) {
	const url = cursor ? `/api/v1/posts?cursor=${cursor}` : `/api/v1/posts`
	const res = await getFetch(url)
	return res
}
export async function createPost(data: CreatePostData) {
	const res = await postFetch(`/api/v1/posts`, data)
	return res
}

export async function getPostById(postId: string) {
	const res = await getFetch(`/api/v1/posts/${postId}`)
	return res
}

export async function deletePostById(postId: string) {
	const res = await deleteFetch(`/api/v1/posts/${postId}`)
	return res
}

export async function updatePostById(
	postId: string,
	data: Omit<CreatePostData, "carId">,
) {
	const res = await putFetch(`/api/v1/posts/${postId}`, data)
	return res
}

export async function myPost(cursor?: string) {
	const url = cursor ? `/api/v1/posts/me?cursor=${cursor}` : `/api/v1/posts/me`
	const res = await getFetch(url)
	return res
}

export async function deletePostLike(postId: string) {
	const res = await deleteFetch(`/api/v1/posts/${postId}/like`)
	return res
}

export async function getUserPostLikes(postId: string, cursor?: string) {
	const res = await getFetch(`/api/v1/posts/${postId}/like`)
	return res
}

export async function addUserPostLikes(postId: string) {
	const res = await postFetch(`/api/v1/posts/${postId}/like`, null)
	return res
}
