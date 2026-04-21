import { ChevronDown, Filter } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 h-9 w-64 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-5 w-80 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Filter Dropdown Skeleton */}
          <div className="flex h-9.5 w-35 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm">
            <Filter className="h-4 w-4 text-gray-400" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Appointments List Skeleton */}
        <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all sm:flex-row"
            >
              {/* Left Column - Date and Time Hub Skeleton */}
              <div className="relative flex shrink-0 flex-row items-center justify-center border-b border-gray-100 bg-linear-to-b from-gray-50 to-gray-100 p-4 sm:w-32.5 sm:flex-col sm:border-b-0 sm:border-r sm:p-6">
                <div className="mb-2 h-4 w-12 animate-pulse rounded bg-gray-200" />
                <div className="mb-1 h-8 w-10 animate-pulse rounded bg-gray-300" />
                <div className="mt-2 h-6 w-16 animate-pulse rounded bg-gray-300" />
                <div className="mt-1 h-3 w-8 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Right Column - Information & Actions Skeleton */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {/* Header section Skeleton */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <div className="mb-3 h-6 w-24 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-6 w-48 animate-pulse rounded bg-gray-300" />
                  </div>
                  <div className="mt-1 h-6 w-20 animate-pulse rounded-full bg-gray-200 sm:mt-0" />
                </div>

                {/* Info Grid Skeleton */}
                <div className="mb-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4">
                  <div>
                    <div className="mb-1 h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
                  </div>
                  <div>
                    <div className="mb-1 h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>

                {/* Notes Block Skeleton */}
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
                  <div className="flex-1">
                    <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="mt-auto flex flex-col justify-end gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  {/* Message Button Placeholder */}
                  <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200 sm:w-32" />

                  {/* Action Buttons Container */}
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200 sm:w-24" />
                    <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200 sm:w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
