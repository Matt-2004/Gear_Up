"use client"

import { AddComment, CommentData } from "@/app/types/comment.types"
import {
	addComment,
	getCommentsByPostId,
	getNestedCommentsByCommentId,
} from "@/utils/FetchAPI"
import { diffFromNowAuto } from "@/utils/timeFormat"
import * as signalR from "@microsoft/signalr"
import clsx from "clsx"
import { Heart, Reply } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface ICommnetsProps {
	access_token: string
	postId: string
	level: number
}

export const Comment = ({ access_token, postId, level }: ICommnetsProps) => {

	const contentRef = useRef<HTMLDivElement>(null)
	const [commentData, setCommentData] = useState<CommentData[]>([])
	const [openReplyId, setOpenReplyId] = useState<string | null>(null)
	const [replyText, setReplyText] = useState<string>("")
	const [showingReplayById, setShowingReplayById] = useState<string | null>(
		null,
	)

	const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
	// get the id of the comment to show reply


	const handleReplySubmit = async ({ postId, text, parentCommentId }: AddComment) => {
		console.log("This function is working...")
		try {
			await addComment({ postId, text, parentCommentId })
		} catch (err) {
			console.error("Error in creating comment:: ", err)
		}
	}

	const handleActiveReply = (id: string | null) => {
		setActiveReplyId(id)
		setReplyText("")
	}
	useEffect(() => {
		if (!postId) {
			console.log("Id doesn't exist")
			return
		}

		// SignalR connection start
		const connection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5255/hubs/post", {
				accessTokenFactory: () => access_token
			})
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()

		// Join group to Commnet Group
		const JoinGroups = async () => {

			await connection.start().catch(err => console.error(err))

			try {
				await connection.invoke('JoinGroup', postId)
				await connection.invoke('JoinCommentsGroup', postId)
			} catch (err) {
				console.error("Join group error:: ", err)
			}
		}
		// Join Group
		JoinGroups()

		connection.on('CommentCreated', (event) => {
			setCommentData(prevComments => [event, ...prevComments])
			console.log("Comment created:: ", event)
		})



		return () => {
			connection.off("CommentCreated")
			connection.stop()
		}
	}, [])

	useEffect(() => {
		if (level === 0) {
			const fetchComments = async () => {
				const data = await getCommentsByPostId(postId)
				setCommentData(data)
			}
			fetchComments()
		} else {
			// For nested comments, you might want to implement a different API call

			const fetchNestedComments = async () => {
				const data = await getNestedCommentsByCommentId(postId)
				setCommentData(data)
			}
			fetchNestedComments()
		}
	}, [postId, level])

	return (
		<div className={clsx(level > 0 ? "pl-12" : "pl-6", "relative space-y-4 mt-2")}>
			{/* vertical guide for this nested block (only visible for nested levels) */}
			{level > 0 && (
				<div
					className={clsx(
						"absolute -top-4 bottom-0 left-4 h-[calc(100%-4.8rem)] w-px bg-gray-300",
					)}
					aria-hidden
				/>
			)}

			{commentData.map((comment, i) => (
				<div key={i} className="relative">
					{/* connector from vertical guide to this comment */}

					{level > 0 && (
						<div
							className={`absolute -top-2 -left-8 h-10 w-7 rounded-bl-xl border-b border-l border-gray-300 bg-white`}
							aria-hidden
						/>
					)}

					<div className="w-full">
						<div className="flex w-full gap-4">
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
									<div className="rounded-lg">
										<h1 className="text-sm ">
											{comment.commentedUserName}
										</h1>
										<p ref={contentRef} className="text-sm">
											{comment.content}
										</p>
									</div>
									{/* Timeline */}
									<div className="mb-2">
										<h3 className="text-xs font-light">{diffFromNowAuto(comment.createdAt).value} {diffFromNowAuto(comment.createdAt).unit} ago</h3>
									</div>
									{/* Comment Actions */}
									<div className="flex flex-col items-start gap-2">
										<div className="flex items-center gap-2">
											<LikeCount likeCount={comment.likeCount} />
											<ReplyBtn
												handleActiveReply={handleActiveReply}
												comment={comment}
											/>
										</div>
									</div>
									{/* Reply text box and submit button (render only for this comment) */}
									{activeReplyId === String(comment.id || i) && (

										<div className="mt-2 w-full ">
											<CommentTextBox
												value={replyText}
												onChange={setReplyText}
												onSubmit={() =>
													handleReplySubmit({
														postId: comment.postId,
														text: replyText,
														parentCommentId: String(comment.id),
													})
												}
												onCancel={() => setActiveReplyId(null)}
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
											className="absolute top-[calc(100%-1.4rem)] left-4 h-4 w-7 rounded-bl-full border-b border-l border-gray-300 "
											aria-hidden
										/>
										<button
											onClick={() => setShowingReplayById(comment.id)}
											className="mt-3 cursor-pointer text-start text-xs text-gray-600 hover:underline"
										>
											Show {comment.childCount} replies
										</button>
									</>
								)}
							</div>
						</div>

						{showingReplayById === comment.id && (
							<Comment access_token={access_token} postId={showingReplayById} level={level + 1} />
						)}
					</div>
				</div>
			))}

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
				<button onClick={onCancel} className="rounded cursor-pointer border px-3 py-1 text-sm">
					Cancel
				</button>
				<button
					onClick={onSubmit}
					className="bg-primary active:bg-primary-dark cursor-pointer rounded px-5 py-1 text-white"
				>
					Post
				</button>
			</div>
		</div>
	)
}

export const ReplyBtn = ({ handleActiveReply, comment }: { handleActiveReply: (id: string) => void, comment: CommentData }) => {
	return (
		<button
			className="hover:bg-primary-background hover:text-primary flex cursor-pointer items-center gap-1 rounded-md  text-gray-600"
			onClick={() =>
				handleActiveReply(
					String(comment.id),
				)
			}
		>
			<Reply className=" h-4 w-4 -scale-x-100 font-normal" />
			<h3 className="text-xs font-light">

				Reply
			</h3>
		</button>
	)
}

export const LikeCount = ({ likeCount }: { likeCount: number }) => {
	return (
		<button className="hover:bg-primary-background hover:text-primary flex cursor-pointer items-center gap-1 rounded-md  text-gray-600">
			<Heart className="h-4 w-4 font-normal" />
			<h3 className="font-light text-sm">{likeCount}</h3>
		</button>
	)
}
