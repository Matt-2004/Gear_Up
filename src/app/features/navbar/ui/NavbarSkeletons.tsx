import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export function NotificationSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="w-3/4" />
            <SkeletonText className="w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
