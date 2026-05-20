import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

function PostCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Author row */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <SkeletonText className="w-24" />
          <SkeletonText className="w-16" />
        </div>
      </div>

      {/* Image placeholder */}
      <Skeleton className="mx-4 mt-3 aspect-[16/10] rounded-xl" />

      {/* Caption */}
      <div className="space-y-1.5 px-4 pt-4">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-full" />
        <SkeletonText className="w-1/2" />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-6 px-4 py-3">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-14 rounded" />
      </div>
    </div>
  );
}

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-48" />
          <SkeletonText className="w-64" />
        </div>

        {/* Post card skeletons */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
