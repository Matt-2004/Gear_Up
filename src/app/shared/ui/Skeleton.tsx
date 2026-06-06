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

/** Skeleton matching CarCard dark theme and layout */
export function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
      {/* Image area — matches CarCard aspect-4/3 */}
      <div className="relative aspect-4/3 overflow-hidden bg-white/5">
        <Skeleton className="absolute inset-0 rounded-none bg-white/[0.06]" />
        {/* Condition badge placeholder */}
        <Skeleton className="absolute left-3 top-3 h-5 w-16 rounded-full bg-white/10" />
      </div>

      {/* Content — matches CarCard p-5 */}
      <div className="flex flex-1 flex-col p-5">
        {/* Make + Model label */}
        <Skeleton className="h-3 w-24 rounded-sm bg-white/10" />

        {/* Title — two lines matching line-clamp-2 */}
        <div className="mt-1.5 space-y-1.5">
          <Skeleton className="h-4 w-full rounded-sm bg-white/10" />
          <Skeleton className="h-4 w-2/3 rounded-sm bg-white/10" />
        </div>

        {/* Specs row — 3 items matching mileage / transmission / fuel */}
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-3.5 w-16 rounded-sm bg-white/10" />
          <Skeleton className="h-3.5 w-12 rounded-sm bg-white/10" />
          <Skeleton className="h-3.5 w-14 rounded-sm bg-white/10" />
        </div>

        {/* Price + CTA row with divider */}
        <div className="mt-4 flex items-end justify-between border-t border-white/8 pt-4">
          <Skeleton className="h-6 w-28 rounded-sm bg-white/10" />
          <Skeleton className="h-4 w-14 rounded-sm bg-white/10" />
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
