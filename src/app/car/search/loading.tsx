import { Skeleton } from "@/app/shared/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="mb-4 h-10 w-48 rounded-md bg-white/10" />
          <Skeleton className="h-12 w-full max-w-xl rounded-xl bg-white/10" />
        </div>
        <div className="flex items-center justify-center py-16">
          <Skeleton className="h-16 w-16 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
