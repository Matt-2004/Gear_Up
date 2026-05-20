import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function DealerAppointmentsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <SkeletonText className="w-96" />
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>

        {/* Appointment cards */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-44" />
                    <SkeletonText className="w-32" />
                    <SkeletonText className="w-64" />
                    <SkeletonText className="w-40" />
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Skeleton className="h-9 w-20 rounded-xl" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
