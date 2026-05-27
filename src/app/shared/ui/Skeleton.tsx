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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        {/* Title + Price row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-5 w-28 rounded-md" />
          </div>
          <Skeleton className="h-5 w-16 shrink-0 rounded-md" />
        </div>
        {/* Specs grid — 2x2 pushed to bottom */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
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
