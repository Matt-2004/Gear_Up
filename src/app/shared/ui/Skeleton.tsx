import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-gray-200", className)}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={clsx("h-4", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <SkeletonText className="w-3/4" />
            <SkeletonText className="w-1/2" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-16 w-full max-w-xl" />
      <Skeleton className="h-12 w-32" />
    </div>
  );
}
