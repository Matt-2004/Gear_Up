import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-gray-100 bg-white p-4 lg:w-64">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-32" />
          <SkeletonText className="w-40" />
        </div>
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-xl" />
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <SkeletonText className="w-80" />
          </div>

          {/* Stats Cards Row 1 */}
          <section className="space-y-4">
            <SkeletonText className="w-36" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          </section>

          {/* Stats Cards Row 2 */}
          <section className="space-y-4">
            <SkeletonText className="w-32" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          </section>

          {/* Quick Actions + Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-52 rounded-2xl lg:col-span-1" />
            <Skeleton className="h-52 rounded-2xl lg:col-span-2" />
          </div>

          {/* System Overview */}
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
