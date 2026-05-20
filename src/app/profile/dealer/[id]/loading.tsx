import { Skeleton } from "@/app/shared/ui/Skeleton";

export default function DealerProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="from-primary-600 to-primary-800 bg-linear-to-br pb-16 pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:gap-6">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-white sm:h-28 sm:w-28" />
            <div className="mt-4 text-center sm:mt-0 sm:text-left space-y-2">
              <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
              <div className="flex gap-3 justify-center sm:justify-start">
                <Skeleton className="h-5 w-36 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Cars */}
      <div className="mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        <div className="mb-12">
          <Skeleton className="mb-4 h-6 w-24" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
