import { clsx } from "clsx";

function P({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-white/[0.06]",
        className,
      )}
    />
  );
}

export default function CarDetailLoading() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #000000 0%, #0a0f05 3%, #061E09 50%, #0a0f05 97%, #000000 100%)",
      }}
    >
      {/* Gallery skeleton */}
      <div className="pb-8 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 pt-6 md:pt-8 space-y-4">
          <P className="aspect-[16/9] w-full rounded-2xl" />
          <div className="flex gap-3">
            <P className="h-16 w-24 shrink-0 rounded-lg" />
            <P className="h-16 w-24 shrink-0 rounded-lg" />
            <P className="h-16 w-24 shrink-0 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-16 lg:col-span-2">
            <div className="space-y-6">
              <P className="h-5 w-24 rounded-full" />
              <P className="h-8 w-56 rounded-lg" />
              <P className="h-32 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <P className="h-5 w-28 rounded-full" />
              <P className="h-8 w-64 rounded-lg" />
              <P className="h-4 w-48 rounded" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <P className="h-28 rounded-xl" />
                <P className="h-28 rounded-xl" />
                <P className="h-28 rounded-xl" />
                <P className="h-28 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <P className="sticky top-24 h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
