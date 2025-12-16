"use client"

import {
	CarImage,
	LatestComment,
	PostData,
	PostItem,
} from "@/app/types/post.types"
import { timeFormat } from "@/utils/timeFormat"
import {
	ChevronLeft,
	ChevronRight,
	Heart,
	MessageCircleMore,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const DiscoverPost = ({ post }: { post: PostData }) => {
	return (
		<div className="min-h-screen min-w-screen">
			<div className="flex h-full w-full justify-center">
				<div className="flex w-full flex-col items-center justify-center gap-1 overflow-hidden sm:w-[80%] md:w-[60%] lg:w-[40%]">
					{post.items.map((p, i) => (
						<div key={i}>
							<PostCard postItem={p} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

interface IPostCard {
	postItem: PostItem
}

const PostCard = ({ postItem }: IPostCard) => {
	return (
		<section className="h-full min-w-full rounded-lg bg-white p-4">
			{/* Date and Time */}
			<h3 className="text-xs text-gray-500">
				{timeFormat(postItem.updatedAt, "Date")}
			</h3>
			{/* Caption and Content */}
			<div className="flex w-full flex-col gap-2">
				<h1 className="text-xl font-medium">{postItem.caption}</h1>
				<PostContent postContent={postItem.content} />
			</div>
			{/* <h3>{postItem.visibility}</h3> */}
			<CarouselPostImage carImage={postItem?.carDto?.carImages} />

			{/* Like and Commnet */}
			<LikeAndCommentBtn
				likeCount={postItem.likeCount}
				commentCount={postItem.commentCount}
			/>
			<Comment comments={postItem.latestComments} />
		</section>
	)
}

interface IPostContentProps {
	postContent: string
}

const PostContent = ({ postContent }: IPostContentProps) => {
	const [expanded, setExpanded] = useState(false)

	// This function is used to scroll to the current index

	const LIMIT = 120
	const isLong = postContent.length > LIMIT

	const displayText =
		expanded || !isLong ? postContent : postContent.slice(0, LIMIT)
	return (
		<p className="text-sm leading-relaxed">
			<span className={expanded ? "" : "line-clamp-2"}>{displayText}</span>

			{!expanded && isLong && (
				<button
					onClick={() => setExpanded(true)}
					className="ml-1 font-medium text-blue-500 hover:underline"
				>
					see more
				</button>
			)}
		</p>
	)
}
interface ICarouselPostImageProps {
	carImage: CarImage[]
}

const CarouselPostImage = ({ carImage }: ICarouselPostImageProps) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLImageElement>(null)
	const [currentIndex, setCurrentIndex] = useState<number>(0)

	function scrollNext() {
		if (!scrollRef.current) return

		scrollRef.current.scrollBy({
			left: scrollRef.current.clientWidth,
			behavior: "smooth",
		})
	}

	function scrollPrevious() {
		if (!scrollRef.current) return

		scrollRef.current.scrollBy({
			left: -scrollRef.current.clientWidth,
			behavior: "smooth",
		})
	}

	useEffect(() => {
		const container = scrollRef.current
		if (!container) return

		const handleScroll = () => {
			const index = Math.round(container.scrollLeft / container.clientWidth)
			setCurrentIndex(index)
		}

		container.addEventListener("scroll", handleScroll)

		return () => container.removeEventListener("scroll", handleScroll)
	}, [])
	return (
		<div className="relative z-20 mt-4">
			<div
				ref={scrollRef}
				className="flex snap-x snap-mandatory overflow-x-scroll scroll-smooth"
				style={{ scrollbarWidth: "none" }}
			>
				{carImage?.map((image, i) => (
					<Image
						key={i}
						ref={imageRef}
						src={image.url}
						alt={image.carId}
						width={200}
						height={200}
						className="block min-w-full snap-start"
					></Image>
				))}

				{/* Left and right icons */}
				{currentIndex !== 0 && (
					<button
						onClick={() => scrollPrevious()}
						className="absolute top-1/2 left-0 z-30 translate-x-1/2 cursor-pointer rounded-full bg-white/70 p-2 shadow-lg backdrop-blur-md active:bg-white/90"
					>
						<ChevronLeft className="text-primary h-8 w-8" />
					</button>
				)}
				{currentIndex < carImage?.length - 1 && (
					<button
						onClick={() => scrollNext()}
						className="absolute top-1/2 right-12 z-30 translate-x-1/2 cursor-pointer rounded-full bg-white/70 p-2 shadow-lg backdrop-blur-md active:bg-white/90"
					>
						<ChevronRight className="text-primary h-8 w-8" />
					</button>
				)}
			</div>
		</div>
	)
}

interface ILikeAndCommentBtnProps {
	likeCount: number
	commentCount: number
}

const LikeCount = ({ likeCount }: { likeCount: number }) => {
	return (
		<div className="hover:bg-primary-background hover:text-primary flex cursor-pointer gap-1 rounded-md py-1">
			<Heart className="h-5 w-5" />
			<h3 className="text-sm">{likeCount}</h3>
		</div>
	)
}

const CommentCount = ({ commentCount }: { commentCount: number }) => {
	return (
		<div className="hover:bg-primary-background hover:text-primary flex cursor-pointer gap-1 rounded-md py-1">
			<MessageCircleMore className="h-5 w-5" />
			<h3 className="text-sm">{commentCount}</h3>
		</div>
	)
}

const LikeAndCommentBtn = ({
	likeCount,
	commentCount,
}: ILikeAndCommentBtnProps) => {
	return (
		<div className="flex gap-4 p-2">
			<LikeCount likeCount={likeCount} />
			<CommentCount commentCount={commentCount} />
		</div>
	)
}

interface ICommnetsProps {
	comments: LatestComment[]
}

const Comment = ({ comments }: ICommnetsProps) => {
	return (
		<div className="ml-8 space-y-4">
			{comments.map((comment, i) => (
				<div key={i} className="w-full">
					<div className="flex w-full">
						<Image
							src={comment.commentedUserProfilePictureUrl}
							alt={comment.commentedUserName}
							width={40}
							height={40}
							className="mt-2 h-10 w-10 rounded-full"
						/>
						<div className="mb-4 flex w-fit flex-col">
							<div className="rounded-lg px-4 py-1">
								<h1 className="text-sm font-semibold">
									{comment.commentedUserName}
								</h1>
								<p className="text-sm">{comment.content}</p>
							</div>
							<div className="flex items-center gap-2 pl-4">
								<LikeCount likeCount={comment.likeCount} />
								<h3 className="text-sm">Reply</h3>
							</div>
						</div>
					</div>
					{comment?.replies && comment.replies.length > 0 && (
						<Comment comments={comment.replies} />
					)}
				</div>
			))}
		</div>
	)
}

export default DiscoverPost
