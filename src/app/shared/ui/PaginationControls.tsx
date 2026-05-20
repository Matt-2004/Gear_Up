"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
  startIndex?: number;
  endIndex?: number;
  totalItems?: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  isLoading = false,
  startIndex,
  endIndex,
  totalItems,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
      {/* Item count */}
      <p className="text-sm text-gray-500">
        {startIndex !== undefined && endIndex !== undefined && totalItems !== undefined
          ? `Showing ${startIndex + 1}–${endIndex} of ${totalItems}`
          : `Page ${currentPage} of ${totalPages}`}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev || isLoading}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium transition-all",
            hasPrev && !isLoading
              ? "text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              : "cursor-not-allowed text-gray-400 opacity-50",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page indicator */}
        <span className="inline-flex min-w-[5rem] items-center justify-center rounded-xl bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-700">
          {isLoading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          ) : (
            `Page ${currentPage}`
          )}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext || isLoading}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium transition-all",
            hasNext && !isLoading
              ? "text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              : "cursor-not-allowed text-gray-400 opacity-50",
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
