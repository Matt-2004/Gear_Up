"use client"

import { CommentData } from "@/types/comment.types"

import { createContext, ReactNode, useContext, useState } from "react"

export interface ICommentProps extends CommentData {
	replies?: ICommentProps[]
}

interface ICommentContext {
	comments: ICommentProps[]
	// Add a comment (top-level) or insert replies under parent (nested, up to level 3)
	handleComment: (
		newComment: CommentData | CommentData[],
		parentCommentId: string | null,
	) => void

	// Used only to trigger fetching nested replies (Details.tsx listens to this)
	requestedParentCommentId: string
	handleParentIdUpdate: (parentCommentId: string) => void

	// Used for UI expansion state (supports expanding multiple threads)
	expandedCommentIds: string[]
	toggleExpandedCommentId: (commentId: string) => void

	// toggleLikeComment: (commentId: string) => void
}
// comment + replies

export const CommentContext = createContext<ICommentContext>(null as any)

const CommentContextProvider = ({ children }: { children: ReactNode }) => {
	const [comments, setComments] = useState<ICommentProps[]>([])
	const [requestedParentCommentId, setRequestedParentCommentId] =
		useState<string>("")
	const [expandedCommentIds, setExpandedCommentIds] = useState<string[]>([])
	function handleComment(
		newComment: CommentData | CommentData[],
		parentCommentId: string | null,
	) {
		const normalized: ICommentProps[] = (
			Array.isArray(newComment) ? newComment : [newComment]
		) as any

		// Level meaning:
		// - Top-level comments are level 1
		// - Replies are level 2
		// - Child replies are level 3
		// No inserts beyond level 3.
		const MAX_LEVEL = 3

		if (!parentCommentId) {
			setComments((prev) => [...normalized, ...prev])
			return
		}

		const insertReplies = (
			list: ICommentProps[],
			parentId: string,
			currentLevel: number,
		): { next: ICommentProps[]; inserted: boolean } => {
			let inserted = false
			const next = list.map((item) => {
				if (item.id === parentId) {
					// If parent is already at MAX_LEVEL, inserting would create level 4 -> ignore.
					if (currentLevel >= MAX_LEVEL) return item
					inserted = true
					return {
						...item,
						replies: item.replies
							? [...normalized, ...item.replies]
							: [...normalized],
					}
				}

				if (
					item.replies &&
					item.replies.length > 0 &&
					currentLevel < MAX_LEVEL
				) {
					const child = insertReplies(item.replies, parentId, currentLevel + 1)
					if (child.inserted) inserted = true
					return child.inserted ? { ...item, replies: child.next } : item
				}

				return item
			})
			return { next, inserted }
		}

		setComments((prev) => insertReplies(prev, parentCommentId, 1).next)
	}

	function handleParentIdUpdate(parentCommentId: string) {
		setRequestedParentCommentId(parentCommentId)
	}

	function toggleExpandedCommentId(commentId: string) {
		setExpandedCommentIds((prev) =>
			prev.includes(commentId)
				? prev.filter((id) => id !== commentId)
				: [...prev, commentId],
		)
	}

	return (
		<CommentContext.Provider
			value={{
				comments,
				handleComment,
				requestedParentCommentId,
				handleParentIdUpdate,
				expandedCommentIds,
				toggleExpandedCommentId,
			}}
		>
			{children}
		</CommentContext.Provider>
	)
}

export default CommentContextProvider

export const useCommentContext = () => {
	const context = useContext(CommentContext)
	if (!context) {
		throw new Error(
			"useCommentContext must be used within a CommentContextProvider",
		)
	}
	return context
}
