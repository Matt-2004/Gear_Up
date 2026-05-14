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
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4">
      <Skeleton className="aspect-video w-full" />
      <SkeletonText className="w-3/4" />
      <SkeletonText className="w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
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
