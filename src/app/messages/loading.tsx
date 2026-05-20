import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

export default function MessagesLoading() {
  return (
    <div className="flex h-screen w-full flex-col bg-white sm:flex-row">
      {/* Chat area */}
      <div className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <SkeletonText className="w-28" />
        </div>

        {/* Message bubbles */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          {/* Received message */}
          <div className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton className="h-20 w-64 rounded-2xl" />
          </div>

          {/* Sent message */}
          <div className="flex justify-end">
            <Skeleton className="h-16 w-56 rounded-2xl" />
          </div>

          {/* Received */}
          <div className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton className="h-14 w-48 rounded-2xl" />
          </div>

          {/* Sent */}
          <div className="flex justify-end">
            <Skeleton className="h-24 w-72 rounded-2xl" />
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
