import { AddComment } from "@/types/comment.types"
import { deleteFetch, getFetch, postFetch, putFetch } from "./AxiosClient"

export async function getCommentsByPostId(postId: string) {
	const res = await getFetch(`/api/v1/comments/${postId}/top`)
	return res
}

export async function getNestedCommentsByCommentId(parentCommentId: string) {
	const res = await getFetch(`/api/v1/comments/${parentCommentId}/childrens`)
	return res
}

export async function addComment(data: AddComment) {
	const res = await postFetch(`/api/v1/comments`, data)
	return res
}

export async function addLikeToComment(commentId: string) {
	const res = await postFetch(`/api/v1/comments/${commentId}/like`, null)
	return res
}

export async function updateCommentById(commentId: string, content: string) {
	const res = await putFetch(`/api/v1/comments/${commentId}`, content)
	return res
}

export async function deleteCommentById(commentId: string) {
	const res = await deleteFetch(`/api/v1/comments/${commentId}`)
	return res
}
