"use client";

import { useCallback, useMemo, useState } from "react";

interface UseVirtualPaginationOptions {
  totalItems: number;
  pageSize?: number;
}

interface UseVirtualPaginationResult {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrev: boolean;
  hasNext: boolean;
  goNext: () => void;
  goPrev: () => void;
  goToPage: (page: number) => void;
  /** Items to display on the current page (caller slices) */
  getPageRange: () => { start: number; end: number };
}

export function useVirtualPagination({
  totalItems,
  pageSize = 15,
}: UseVirtualPaginationOptions): UseVirtualPaginationResult {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Keep currentPage in bounds when totalItems changes (e.g. after filter)
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  const goNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const getPageRange = useCallback(
    () => ({ start: startIndex, end: endIndex }),
    [startIndex, endIndex],
  );

  // Reset to page 1 when totalPages shrinks (e.g. after filter)
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage: safePage,
    totalPages,
    startIndex,
    endIndex,
    hasPrev,
    hasNext,
    goNext,
    goPrev,
    goToPage,
    getPageRange,
  };
}
