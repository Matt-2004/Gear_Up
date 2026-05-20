import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function UserAppointmentsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-56" />
          <SkeletonText className="w-80" />
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-xl" />
          ))}
        </div>

        {/* Appointment cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-40" />
                    <SkeletonText className="w-32" />
                    <SkeletonText className="w-56" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
