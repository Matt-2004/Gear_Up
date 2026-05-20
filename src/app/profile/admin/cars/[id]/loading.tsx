import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function AdminCarDetailLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Back button */}
        <Skeleton className="mb-6 h-10 w-24 rounded-xl" />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image gallery */}
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="aspect-[16/10] rounded-2xl" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            </div>

            {/* Basic info */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <SkeletonText className="w-16" />
                    <SkeletonText className="w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <SkeletonText className="w-16" />
                    <SkeletonText className="w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <SkeletonText className="w-20" />
                  <SkeletonText className="w-48" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
