"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  DEFAULT_DEALER_TAB,
  isDealerTabId,
  type DealerTabId,
} from "@/app/features/dashboards/dealer/utils/dealer-tabs.config";
import { PageItem } from "@/app/profile/dealer/page";

export const PageSwitcher = ({ pages = [] }: { pages?: PageItem[] }) => {
  const searchParams = useSearchParams();

  const activePage = useMemo(() => {
    if (!Array.isArray(pages) || pages.length === 0) {
      return null;
    }

    const currentTab = searchParams.get("tab");
    const activeTab = isDealerTabId(currentTab)
      ? currentTab
      : DEFAULT_DEALER_TAB;

    return pages.find((page) => page.id === activeTab) ?? pages[0] ?? null;
  }, [pages, searchParams]);

  if (!activePage) {
    return null;
  }

  return <>{activePage.page}</>;
};
