import { Skeleton } from "@/app/shared/ui/Skeleton";

export default function CarDetailLoading() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content Skeleton */}
          <div className="space-y-12 lg:col-span-2">
            <Skeleton className="h-125 w-full rounded-2xl lg:h-175" />
            <div className="flex gap-3">
              <Skeleton className="aspect-video w-1/3 rounded-lg" />
              <Skeleton className="aspect-video w-1/3 rounded-lg" />
              <Skeleton className="aspect-video w-1/3 rounded-lg" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </div>
          {/* Sidebar Skeleton */}
          <div className="space-y-4 lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
