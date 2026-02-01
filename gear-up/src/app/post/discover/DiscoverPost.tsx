"use client";

import { AllPostData, CarImage, PostItem } from "@/app/types/post.types";
import { IUser } from "@/app/types/user.types";
import { getAllPosts } from "@/utils/FetchAPI";
import { timeFormat } from "@/utils/timeFormat";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { DEFAULT_API_URL } from "@/lib/config";
import { useEffect, useRef, useState } from "react";
import { LikeCount } from "./Comment";

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

const DiscoverPost = ({ post, user }: { post: AllPostData; user: IUser }) => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<
      AllPostData,
      Error,
      InfiniteData<AllPostData, number>,
      string[],
      number
    >({
      queryKey: ["discover-posts"],
      queryFn: ({ pageParam = 1 }) => getAllPosts("lastest", pageParam),
      initialPageParam: 1,
      initialData: {
        pages: [post],
        pageParams: [1],
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    });

  const posts = data.pages.flatMap((page) => page.items) ?? [];

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    estimateSize: () => 655,
    getScrollElement: () => parentRef.current,
    overscan: 5,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (!hasNextPage || isFetchingNextPage) return;
    if (lastItem.index >= posts.length - 3) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    posts.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  return (
    <div
      ref={parentRef}
      className="relative h-screen w-full overflow-y-auto bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="h-full w-full flex justify-center py-8">
        <div className="sm:w-[80%] md:w-[60%] lg:w-[40%]">
          <div
            className="relative w-full min-h-screen"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {virtualItems.map(({ index, start, key, size }) => {
              const postItem = posts[index];

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
                  <div className="px-2 pb-4">
                    <PostCard postItem={postItem} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {user.role === "Dealer" && <CreatePostButton />}
    </div>
  );
};

const CreatePostButton = () => {
  const router = useRouter();

  return (
    <div className="fixed right-16 bottom-10 z-50">
      <button
        onClick={() => router.push("/post/create")}
        className="flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <Plus className="text-primary-600 h-4 w-4" />
        </div>
        Create Post
      </button>
    </div>
  );
};

interface IPostCard {
  postItem: PostItem;
}

const PostCard = ({ postItem }: IPostCard) => {
  const router = useRouter();

  if (!postItem) return null;
  return (
    <section
      onClick={() => {
        router.push(`${DEFAULT_API_URL}/post/${postItem.id}`);
      }}
      className="min-w-full max-w-full rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 flex flex-col"
      style={{ minHeight: "600px", maxHeight: "650px" }}
    >
      {/* Header Section with Date */}
      <div className="px-6 pt-5 pb-4">
        {/* Date and Time */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {timeFormat(postItem.updatedAt, "Date")}
          </h3>
        </div>
        {/* Caption and Content */}
        <div className="flex w-full flex-col gap-3">
          <h1 className="line-clamp-2 text-2xl font-bold text-gray-900 leading-tight hover:text-primary-600 transition-colors">
            {postItem.caption}
          </h1>
          <PostContent postContent={postItem.content} />
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 overflow-hidden">
        <CarouselImages images={postItem?.carDto?.carImages} />
      </div>

      {/* Actions Section */}
      <div className="flex gap-6 px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white mt-auto">
        <LikeCount
          id={postItem.id}
          isLikedByCurrentUser={postItem.isLikedByCurrentUser}
          likeCount={postItem.likeCount}
        />
        <CommentCount commentCount={postItem.commentCount} />
      </div>
      {/* Comments Section */}
      {/* If comment show... */}
    </section>
  );
};
interface IPostContentProps {
  postContent: string;
}

export const PostContent = ({ postContent }: IPostContentProps) => {
  const [expanded, setExpanded] = useState(false);

  // This function is used to scroll to the current index

  const LIMIT = 120;
  const isLong = postContent.length > LIMIT;

  const displayText =
    expanded || !isLong ? postContent : postContent.slice(0, LIMIT);
  return (
    <div className="text-base leading-relaxed text-gray-600">
      <p className={expanded ? "" : "line-clamp-3"}>
        {displayText}
        {!expanded && isLong && "..."}
      </p>
      {!expanded && isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="mt-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1"
        >
          Read more
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
interface ICarouselPostImageProps {
  images: CarImage[];
}

export const CarouselImages = ({ images }: ICarouselPostImageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  function scrollNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  function scrollPrevious(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: -scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="relative z-10 bg-gray-100">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory items-center overflow-x-scroll scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {images?.map((image, i) => (
          <Image
            key={i}
            ref={imageRef}
            src={image.url}
            alt={image.carId}
            width={200}
            height={200}
            className="block h-112 min-w-full snap-start object-cover"
          ></Image>
        ))}
        {currentIndex !== 0 && (
          <button
            onClick={(e) => scrollPrevious(e)}
            className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="text-primary-600 h-6 w-6" />
          </button>
        )}
        {currentIndex < images?.length - 1 && (
          <button
            onClick={(e) => scrollNext(e)}
            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="text-primary-600 h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const CommentCount = ({ commentCount }: { commentCount: number }) => {
  return (
    <button className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600">
      <div className="flex items-center justify-center h-4 w-4 font-light">
        <MessageCircleMore />
      </div>
      <span className="text-sm font-medium">{commentCount}</span>
    </button>
  );
};

export default DiscoverPost;
