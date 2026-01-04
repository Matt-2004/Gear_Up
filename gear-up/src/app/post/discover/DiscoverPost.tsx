"use client"

import { CarImage, PostData, PostItem } from "@/app/types/post.types"
import { IUser } from "@/app/types/user.types"
import { getAllPosts } from "@/utils/FetchAPI"
import { timeFormat } from "@/utils/timeFormat"
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
	ChevronLeft,
	ChevronRight,
	MessageCircleMore,
	Plus,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { LikeCount } from "./Comment"

/* Discover post -> feeds & create post btn
	
		// create post
		-> fetch the user data
		-> check this step
		if dealership && want create posts:
			-> get the dealer's cars
			-> select - Dealer's Cars
			-> create post page
				- caption
				- context

		else:
			only FEEDS
*/

const DiscoverPost = ({ post, user }: { post: PostData; user: IUser }) => {
	const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
		useInfiniteQuery<
			PostData,
			Error,
			InfiniteData<PostData, number>,
			string[],
			number
		>({
			queryKey: ["discover-posts"],
			queryFn: ({ pageParam }) => getAllPosts(pageParam),
			initialPageParam: 1,
			initialData: {
				pages: [post],
				pageParams: [1],
			},
			getNextPageParam: (lastPage) =>
				lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
		})

	const posts = data.pages.flatMap((page) => page.items) ?? []

	const parentRef = useRef<HTMLDivElement>(null)

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? posts.length + 1 : posts.length,
		estimateSize: () => 660,
		getScrollElement: () => parentRef.current,
		overscan: 5,
	})
	const virtualItems = rowVirtualizer.getVirtualItems()

	useEffect(() => {
		const [lastItem] = [...virtualItems].reverse()

		if (!lastItem) {
			return
		}

		if (!hasNextPage || isFetchingNextPage) return
		if (lastItem.index >= posts.length - 3) {
			fetchNextPage()
		}
	}, [
		hasNextPage,
		fetchNextPage,
		posts.length,
		isFetchingNextPage,
		virtualItems,
	])

	return (
		<div
			ref={parentRef}
			className="relative h-[100vh] min-w-screen overflow-y-auto"
		>
			<div className="flex h-full w-full justify-center">
				<div className="flex w-full flex-col items-center justify-center gap-1 sm:w-[80%] md:w-[60%] lg:w-[40%]">
					<div
						className="relative w-full"
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
						}}
					>
						{virtualItems.map(({ index, start, key, size }) => {
							const postItem = posts[index]

							return (
								<div
									className="absolute top-0 left-0 w-full"
									style={{
										transform: `translateY(${start}px)`,
										height: `${size}px`,
									}}
									key={key}
									data-index={index}
								>
									<div>
										<PostCard postItem={postItem} />
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
			{user.role === "Dealer" && (
				<div className="fixed right-16 bottom-10">
					<button className="bg-primary flex items-center gap-2 rounded-lg px-4 py-2 text-white">
						<div className="flex h-5 w-5 flex-col items-center justify-center rounded-full bg-white">
							<Plus className="text-primary h-4 w-4" />
						</div>
						Create Post
					</button>
				</div>
			)}
		</div>
	)
}

interface IPostCard {
	postItem: PostItem
}

const PostCard = ({ postItem }: IPostCard) => {
	if (!postItem) return null
	return (
		<section className="h-full min-w-full rounded-xl bg-white px-4 py-2">
			{/* Date and Time */}
			<h3 className="text-xs text-gray-500">
				{timeFormat(postItem.updatedAt, "Date")}
			</h3>
			{/* Caption and Content */}
			<div className="flex w-full flex-col gap-2">
				<h1 className="line-clamp-1 text-xl font-medium">{postItem.caption}</h1>
				<PostContent postContent={postItem.content} />
			</div>
			{/* <h3>{postItem.visibility}</h3> */}
			<CarouselPostImage carImage={postItem?.carDto?.carImages} />

			{/* Like and Commnet */}
			<div className="flex gap-4 p-2">
				<LikeCount likeCount={postItem.likeCount} />
				<CommentCount commentCount={postItem.commentCount} />
			</div>
			{/* Comments Section */}
			{/* If comment show... */}
			{/* <Comment id={postItem.id} level={0} /> */}
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
		<div className="relative z-10 mt-4">
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
						className="block h-[28rem] min-w-full snap-start"
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

const CommentCount = ({ commentCount }: { commentCount: number }) => {
	return (
		<div className="hover:bg-primary-background hover:text-primary flex cursor-pointer gap-1 rounded-md px-2 py-1 text-gray-600">
			<MessageCircleMore className="h-5 w-5" />
			<h3 className="text-sm">{commentCount}</h3>
		</div>
	)
}

export default DiscoverPost
