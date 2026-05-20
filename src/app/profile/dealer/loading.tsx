import { Skeleton } from "@/app/shared/ui/Skeleton";

export default function DealerDashboardLoading() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto w-full">
        {/* Tab bar */}
        <div className="border-t border-b border-gray-200 bg-white shadow-sm md:border">
          <div className="sticky top-16.5 z-10 border-b border-gray-200 bg-white">
            <div className="flex gap-1 px-4 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="w-full bg-gray-50/20 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>

              {/* Table skeleton */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
