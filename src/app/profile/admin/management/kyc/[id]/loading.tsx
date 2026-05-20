import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function AdminKycDetailLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back button + header */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48" />
            <SkeletonText className="w-36" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal info card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Skeleton className="mb-6 h-6 w-48" />
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                    <div className="space-y-1.5">
                      <SkeletonText className="w-16" />
                      <SkeletonText className="w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Skeleton className="mb-6 h-6 w-48" />
              <SkeletonText className="mb-3 w-40" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="aspect-[4/3] rounded-xl" />
                <Skeleton className="aspect-[4/3] rounded-xl" />
              </div>
              <SkeletonText className="mb-3 mt-8 w-32" />
              <Skeleton className="h-64 w-80 rounded-xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
