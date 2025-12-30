import { CommentData } from "@/app/types/comment.types"
import {
	getCommentsByPostId,
	getNestedCommentsByCommentId,
} from "@/utils/FetchAPI"
import clsx from "clsx"
import { Heart } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface ICommnetsProps {
	id: string
	level: number
}

export const Comment = ({ id, level }: ICommnetsProps) => {
	const contentRef = useRef<HTMLDivElement>(null)
	const [commentData, setCommentData] = useState<CommentData[]>([])
	const [openReplyId, setOpenReplyId] = useState<string | null>(null)
	const [replyText, setReplyText] = useState<string>("")
	const [showingReplayById, setShowingReplayById] = useState<string | null>(
		null,
	)
	// Default comment count to show at first
	const [defaultCommentCount, setDefaultCommentCount] = useState<number>(1)
	const [showMoreComments, setShowMoreComments] = useState<boolean>(false)

	const [connectorHeight, setConnectorHeight] = useState<number>(0)

	const handleToggleReply = (id: string) => {
		setOpenReplyId((prev) => (prev === id ? null : id))
		if (openReplyId !== id) setReplyText("")
	}

	const handleSubmitReply = (parentId: string) => {
		// TODO: call API / action to post reply
		setOpenReplyId(null)
		setReplyText("")
	}

	useEffect(() => {
		if (level === 0) {
			const fetchComments = async () => {
				const data = await getCommentsByPostId(id)
				setCommentData(data)
			}
			fetchComments()
		} else {
			// For nested comments, you might want to implement a different API call

			const fetchNestedComments = async () => {
				const data = await getNestedCommentsByCommentId(id)
				setCommentData(data)
			}
			fetchNestedComments()
		}
	}, [id, level])

	useEffect(() => {
		if (contentRef.current) {
			setConnectorHeight(contentRef.current.getBoundingClientRect().height)
		}
	}, [])

	return (
		<div className={clsx(level > 0 ? "pl-12" : "pl-6", "relative space-y-4")}>
			{/* vertical guide for this nested block (only visible for nested levels) */}
			{level > 0 && (
				<div
					className={clsx(
						"absolute -top-4 bottom-0 left-4 h-[calc(100%-4.8rem)] w-px bg-gray-300",
					)}
					aria-hidden
				/>
			)}

			{commentData.slice(0, defaultCommentCount).map((comment, i) => (
				<div key={comment.commentedUserId || i} className="relative">
					{/* connector from vertical guide to this comment */}

					{level > 0 && (
						<div
							className={`absolute -top-2 -left-8 h-10 w-7 rounded-bl-xl border-b border-l border-gray-300 bg-white`}
							aria-hidden
						/>
					)}

					<div className="w-full">
						<div className="flex w-full">
							<Image
								src={comment.commentedUserProfilePictureUrl}
								alt={comment.commentedUserName}
								width={60}
								height={40}
								className="mt-2 h-10 w-10 rounded-full"
							/>
							<div className="flex w-full flex-col">
								{/* Comment Content */}
								<div>
									<div className="rounded-lg px-4 py-1">
										<h1 className="text-sm font-semibold">
											{comment.commentedUserName}
										</h1>
										<p ref={contentRef} className="text-sm">
											{comment.content}
										</p>
									</div>
									{/* Comment Actions */}
									<div className="flex flex-col items-start gap-2 pl-4">
										<div className="flex items-center gap-2 pl-3">
											<LikeCount likeCount={comment.likeCount} />
											<button
												className="text-xs text-gray-600 hover:underline"
												onClick={() =>
													handleToggleReply(
														String(comment.commentedUserId || i),
													)
												}
											>
												Reply
											</button>
										</div>
									</div>
									{/* Reply text box and submit button (render only for this comment) */}
									{openReplyId === String(comment.commentedUserId || i) && (
										<div className="mt-2 w-full pl-3">
											<CommentTextBox
												value={replyText}
												onChange={setReplyText}
												onSubmit={() =>
													handleSubmitReply(
														String(comment.commentedUserId || i),
													)
												}
												onCancel={() => setOpenReplyId(null)}
											/>
										</div>
									)}
								</div>
								{comment.childCount > 0 && showingReplayById !== comment.id && (
									<>
										<div
											className="absolute top-14 bottom-0 left-4 h-[calc(100%-4.9rem)] w-px bg-gray-300"
											aria-hidden
										/>
										<div
											className="absolute top-[calc(100%-1.4rem)] left-4 h-4 w-7 rounded-bl-full border-b border-l border-gray-300 bg-white"
											aria-hidden
										/>
										<button
											onClick={() => setShowingReplayById(comment.id)}
											className="mt-3 ml-6 cursor-pointer text-start text-xs text-gray-600 hover:underline"
										>
											Show {comment.childCount} replies
										</button>
									</>
								)}
							</div>
						</div>

						{showingReplayById === comment.id && (
							<Comment id={showingReplayById} level={level + 1} />
						)}
					</div>
				</div>
			))}
			<div
				onClick={() => {
					setShowMoreComments(!showMoreComments)
					setDefaultCommentCount((prev) => prev + commentData.length - 1)
				}}
				className="flex justify-center"
			>
				{level === 0 && !showMoreComments && <h3>Show more</h3>}
			</div>
		</div>
	)
}

export const CommentTextBox = ({
	value,
	onChange,
	onSubmit,
	onCancel,
}: {
	value: string
	onChange: (v: string) => void
	onSubmit: () => void
	onCancel: () => void
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleInputAutoSize = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}
	return (
		<div className="flex w-full flex-col items-stretch gap-2">
			<textarea
				ref={textareaRef}
				value={value}
				onInput={handleInputAutoSize}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Add a comment..."
				className="focus:border-primary w-full rounded-md border border-gray-400 p-2 text-sm focus:outline-none"
				rows={1}
			/>
			<div className="flex justify-end gap-2">
				<button onClick={onCancel} className="rounded border px-3 py-1 text-sm">
					Cancel
				</button>
				<button
					onClick={onSubmit}
					className="bg-primary rounded px-5 py-1 text-white"
				>
					Post
				</button>
			</div>
		</div>
	)
}

export const LikeCount = ({ likeCount }: { likeCount: number }) => {
	return (
		<div className="hover:bg-primary-background hover:text-primary flex cursor-pointer gap-1 rounded-md px-2 py-1 text-gray-600">
			<Heart className="h-5 w-5" />
			<h3 className="text-sm">{likeCount}</h3>
		</div>
	)
}
