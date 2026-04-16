"use client";

import { CarImageDTO, CursorBaseDTO, PostItem } from "@/types/post.types";
import { useUserData } from "@/Context/UserDataContext";
import { DEFAULT_API_URL } from "@/lib/config";
import { getAllPosts } from "@/utils/API/PostAPI";
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

const DiscoverPost = ({ post }: { post: CursorBaseDTO }) => {
  const { user } = useUserData();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useInfiniteQuery<
      CursorBaseDTO,
      Error,
      InfiniteData<CursorBaseDTO, string | undefined>,
      string[],
      string | undefined
    >({
      queryKey: ["discover-posts"],
      queryFn: async ({ pageParam }) => {
        const result = await getAllPosts(pageParam);

        if (result instanceof Response) {
          return (await result.json()) as CursorBaseDTO;
        }

        return result as CursorBaseDTO;
      },
      enabled: Boolean(user),
      initialPageParam: undefined,
      initialData: {
        pages: [post],
        pageParams: [undefined],
      },
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextCursor : undefined;
      },
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    estimateSize: () => (isMobile ? 560 : 650),
    getScrollElement: () => parentRef.current,
    overscan: 3,
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

  // Refetch posts when component mounts or user navigates back
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [refetch, user]);

  if (!isMounted) {
    return <div className="min-h-screen w-full bg-gray-50" />;
  }

  if (!user) {
    return <div>User data not exist!</div>;
  }

  return (
    <div
      ref={parentRef}
      className="relative min-h-screen w-full overflow-y-auto bg-linear-to-br from-gray-50 via-gray-100 to-gray-50"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="flex h-full w-full justify-center px-3 py-4 sm:px-4 sm:py-6">
        <div className="w-full max-w-3xl sm:max-w-2xl md:max-w-2xl lg:max-w-3xl">
          <div
            className="relative w-full"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
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
    <div className="fixed right-4 bottom-6 z-50 sm:right-8 sm:bottom-8 lg:right-10 lg:bottom-10">
      <button
        onClick={() => router.push("/post/create")}
        className="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex transform items-center gap-2 rounded-full bg-linear-to-r px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <Plus className="text-primary-600 h-4 w-4" />
        </div>
        <span className="hidden sm:inline">Create Post</span>
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
      className="group relative flex max-w-full min-w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      style={{ minHeight: "480px" }}
    >
      {/* Header Section with Date */}
      <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
        {/* Date and Time */}
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary-500 h-2 w-2 animate-pulse rounded-full"></div>
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            {timeFormat(postItem.updatedAt, "Date")}
          </h3>
        </div>
        {/* Caption and Content */}
        <div className="flex w-full flex-col gap-3">
          <h1 className="hover:text-primary-600 line-clamp-2 text-lg leading-tight font-bold text-gray-900 transition-colors sm:text-xl md:text-2xl">
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

      <div className="flex gap-4 px-3 pb-3 sm:gap-6 sm:px-4 sm:pb-4">
        <LikeCount
          type="post"
          id={postItem.id}
          isLikedByCurrentUser={postItem.isLikedByCurrentUser}
          likeCount={postItem.likeCount}
        />
        <CommentCount id={postItem.id} commentCount={postItem.commentCount} />
      </div>
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
          className="text-primary-600 hover:text-primary-700 mt-2 inline-flex items-center gap-1 font-semibold transition-colors"
        >
          Read more
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
interface ICarouselPostImageProps {
  images: CarImageDTO[];
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
            className="block h-64 min-w-full snap-start object-cover sm:h-80 md:h-96"
          ></Image>
        ))}
        {currentIndex !== 0 && (
          <button
            onClick={(e) => scrollPrevious(e)}
            className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
          >
            <ChevronLeft className="text-primary-600 h-6 w-6" />
          </button>
        )}
        {currentIndex < images?.length - 1 && (
          <button
            onClick={(e) => scrollNext(e)}
            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
          >
            <ChevronRight className="text-primary-600 h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const CommentCount = ({
  commentCount,
  id,
}: {
  commentCount: number;
  id: string;
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(`${DEFAULT_API_URL}/post/${id}`);
      }}
      className="hover:bg-primary-50 hover:text-primary-600 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-all duration-200"
    >
      <div className="flex h-4 w-4 items-center justify-center font-light">
        <MessageCircleMore />
      </div>
      <span className="text-sm font-medium">{commentCount}</span>
    </button>
  );
};

export default DiscoverPost;
