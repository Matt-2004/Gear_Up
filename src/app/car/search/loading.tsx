import { Skeleton, SkeletonCard } from "@/app/shared/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="mb-4 h-10 w-48" />
          <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
        </div>
        <div className="flex items-center justify-center py-16">
          <Skeleton className="h-16 w-16 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
