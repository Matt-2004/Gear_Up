"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode, useMemo } from "react";

export interface PageItem<T extends string = string> {
  id: T;
  page: ReactNode;
}

interface PageSwitcherProps<T extends string = string> {
  pages?: readonly PageItem<T>[];
  defaultPageId?: T;
  queryKey?: string;
}

export const PageSwitcher = <T extends string = string>({
  pages = [],
  defaultPageId,
  queryKey = "tab",
}: PageSwitcherProps<T>) => {
  const searchParams = useSearchParams();

  const activePage = useMemo(() => {
    if (!Array.isArray(pages) || pages.length === 0) {
      return null;
    }

    const currentTab = searchParams.get(queryKey);

    return (
      pages.find((page) => page.id === currentTab) ??
      pages.find((page) => page.id === defaultPageId) ??
      pages[0] ??
      null
    );
  }, [pages, searchParams, queryKey, defaultPageId]);

  console.log(activePage);

  if (!activePage) {
    return null;
  }

  return <>{activePage.page}</>;
};
