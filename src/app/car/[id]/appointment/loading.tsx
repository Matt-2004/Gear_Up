import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function AppointmentLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="mb-8 h-10 w-40 rounded-xl" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Car info sidebar */}
          <div className="space-y-4 lg:col-span-1">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5">
              <Skeleton className="h-6 w-32" />
              <SkeletonText className="w-24" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-5">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <SkeletonText className="w-20" />
                    <Skeleton className="h-10 rounded-xl" />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <SkeletonText className="w-16" />
                <Skeleton className="h-28 rounded-xl" />
              </div>
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
