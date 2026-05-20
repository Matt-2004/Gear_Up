import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function CreatePostLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-48" />
          <SkeletonText className="w-72" />
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-6 shadow-sm">
          {/* Car select */}
          <div className="space-y-1.5">
            <SkeletonText className="w-16" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <SkeletonText className="w-16" />
            <Skeleton className="h-10 rounded-xl" />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <SkeletonText className="w-16" />
            <Skeleton className="h-48 rounded-xl" />
          </div>

          {/* Submit */}
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
