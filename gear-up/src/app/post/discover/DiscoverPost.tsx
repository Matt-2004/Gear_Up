"use client"

import { PostData, PostItem } from "@/app/types/post.types"
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
				<div className="flex w-full flex-col items-center justify-center gap-1 overflow-hidden sm:w-[80%] md:w-[60%] lg:w-[50%]">
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
	const scrollRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLImageElement>(null)

	const [expanded, setExpanded] = useState(false)

	// This function is used to scroll to the current index
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

	const LIMIT = 120
	const isLong = postItem.content.length > LIMIT

	const displayText =
		expanded || !isLong ? postItem.content : postItem.content.slice(0, LIMIT)
	return (
		<section className="h-full min-w-full rounded-lg bg-white p-4">
			{/* Date and Time */}
			<h3 className="text-xs text-gray-500">
				{timeFormat(postItem.updatedAt, "Date")}
			</h3>
			{/* Caption and Content */}
			<div className="flex w-full flex-col gap-2">
				<h1 className="text-xl font-medium">{postItem.caption}</h1>
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
			</div>
			{/* <h3>{postItem.visibility}</h3> */}
			<div className="relative z-20 mt-4">
				<div
					ref={scrollRef}
					className="flex snap-x snap-mandatory overflow-x-scroll scroll-smooth"
					style={{ scrollbarWidth: "none" }}
				>
					{postItem?.carDto?.carImages.map((image, i) => (
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
					{currentIndex < postItem?.carDto?.carImages.length - 1 && (
						<button
							onClick={() => scrollNext()}
							className="absolute top-1/2 right-12 z-30 translate-x-1/2 cursor-pointer rounded-full bg-white/70 p-2 shadow-lg backdrop-blur-md active:bg-white/90"
						>
							<ChevronRight className="text-primary h-8 w-8" />
						</button>
					)}
				</div>
			</div>

			{/* Like and Commnet */}

			<div className="flex gap-4 p-2">
				<div className="hover:bg-primary-background hover:text-primary flex cursor-pointer items-center justify-center gap-1 rounded-md py-1">
					<Heart className="h-5 w-5" />
					<h3 className="text-sm">{postItem.likeCount}</h3>
				</div>
				<div className="hover:bg-primary-background hover:text-primary flex cursor-pointer items-center justify-center gap-1 rounded-md py-1">
					<MessageCircleMore className="h-5 w-5" />
					<h3 className="text-sm">{postItem.commentCount}</h3>
				</div>
			</div>
		</section>
	)
}

export default DiscoverPost
