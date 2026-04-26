"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode, useMemo } from "react";

interface IPage {
  name: string;
  page: ReactNode;
}

export const PageSwitcher = ({ pages = [] }: { pages?: IPage[] }) => {
  const searchParams = useSearchParams();

  const activePage = useMemo(() => {
    if (!Array.isArray(pages) || pages.length === 0) {
      return null;
    }

    const tab = searchParams.get("tab") ?? pages?.[0]?.name;

    return pages.find((page) => page.name === tab) ?? pages[0];
  }, [pages, searchParams]);

  if (!activePage) {
    return null;
  }

  return <>{activePage.page}</>;
};
