"use client";

import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { DEFAULT_API_URL } from "@/app/shared/utils/config";
import { getAllPosts } from "@/app/shared/utils/API/PostAPI";
import { formatRelativeTime } from "@/app/shared/utils/timeFormat";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  MessageSquare,
  Plus,
} from "lucide-react";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { LikeCount } from "../../comment/ui/Comment";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/app/shared/utils/numberFormatter";
import { PostDTO } from "../types/post.dto";
import { CarImages } from "../../car/types/car.dto";
import { PostModel } from "../types/post.model";
import { PostMapper } from "../types/post.mapper";

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

const DiscoverPost = ({ post }: { post: CursorResponse<PostModel[]> }) => {
  const { user } = useUserData();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useInfiniteQuery<
      CursorResponse<PostModel[]>,
      Error,
      InfiniteData<CursorResponse<PostModel[]>, string | undefined>,
      string[],
      string | undefined
    >({
      queryKey: ["discover-posts"],
      queryFn: async ({ pageParam }) => {
        const result = await getAllPosts(pageParam);
        const data: CursorResponse<PostModel[]> = {
          items: result.data.items.map(PostMapper),
          hasMore: result.data.hasMore,
          nextCursor: result.data.nextCursor,
        };
        return data;
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
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    estimateSize: () => 650,
    getScrollElement: () => parentRef.current,
    overscan: 3,
    measureElement: (el) => el.getBoundingClientRect().height,
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

  if (!user) {
    return <div>User data not exist!</div>;
  }

  return (
    <div
      ref={parentRef}
      className="relative   min-h-screen w-full overflow-y-auto bg-linear-to-br from-gray-50 via-gray-100 to-gray-50"
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
              console.log(`Rendering item at index: ${index}`);
              const postItem = posts[index];

              // if (!postItem) {
              //   return (
              //     <div
              //       key={key}
              //       data-index={index}
              //       ref={rowVirtualizer.measureElement}
              //       className="absolute top-0 left-0 w-full"
              //       style={{
              //         transform: `translateY(${start}px)`,
              //       }}
              //     >
              //       <div className="px-2 pb-4 text-center text-sm text-gray-500">
              //         Loading more posts...
              //       </div>
              //     </div>
              //   );
              // }

              return (
                <div
                  ref={rowVirtualizer.measureElement}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${start}px)`,
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

const PostCard = ({ postItem }: { postItem: PostModel }) => {
  if (!postItem) return null;

  const router = useRouter();
  return (
    <section
      className="group relative flex max-w-full min-w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      style={{ minHeight: "480px" }}
    >
      {/* Header Section with Date */}

      <div className=" pt-4 pb-3  sm:pt-5 sm:pb-4">
        {/* username  */}
        <div className="flex gap-4 pl-4">
          <Image
            alt={postItem.authorUsername}
            src={postItem.authorProfileImage}
            className="rounded-full w-10 h-10"
            width={40}
            height={40}
          />
          <div className="place-items-start">
            <h2
              onClick={() => router.push(`/profile/dealer/${postItem.id}`)}
              className="text-lg font-semibold text-gray-900"
            >
              {postItem.authorUsername}
            </h2>
            {/* Date and Time */}
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-xs font-light tracking-wider text-gray-500">
                {formatRelativeTime(postItem.updatedAt).value}{" "}
                {formatRelativeTime(postItem.updatedAt).unit} ago
              </h3>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 overflow-hidden">
          <CarouselImages
            price={postItem.carDto.price}
            images={postItem.carDto.images || []}
          />
        </div>
        {/* Caption and Content */}
        <div className="flex w-full flex-col gap-3 p-4">
          <h1 className="hover:text-primary-600 line-clamp-2 text-lg leading-tight font-bold text-gray-900 transition-colors sm:text-xl md:text-2xl">
            {postItem.caption}
          </h1>
          <PostContent postContent={postItem.content} />
        </div>
      </div>

      {/* Actions Section */}

      <div className="flex gap-4 px-3 pb-3 sm:gap-4 sm:px-4 sm:pb-4">
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
  images: CarImages[];
  price: number;
}

export const CarouselImages = ({ images, price }: ICarouselPostImageProps) => {
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
      <div className="absolute bottom-4 right-4 bg-white/40 border border-white/30 rounded-full backdrop-blur-md shadow-sm px-4 py-1">
        <h3 className="text-primary text-xl">฿ {formatNumber(price)}</h3>
      </div>
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
            width={600}
            height={600}
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
      <MessageSquare className="h-6 w-6 fill-gray-800 stroke-0" />

      <span className="text-sm font-medium">{commentCount}</span>
    </button>
  );
};

export default DiscoverPost;
