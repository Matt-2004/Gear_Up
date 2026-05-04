"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AdminTabs } from "./AdminTabs";
import { PageSwitcher, PageItem } from "./PageSwitcher";
import {
  type AdminTabId,
  DEFAULT_ADMIN_TAB,
  isAdminTabId,
} from "../../utils/admin-tab.config";

interface AdminPageShellProps {
  pages: PageItem<AdminTabId>[];
  tabs: readonly { id: AdminTabId; label: string }[];
  defaultTabId?: AdminTabId;
}

const getTabFromParams = (
  searchParams: URLSearchParams,
  fallback: AdminTabId,
) => {
  const currentTab = searchParams.get("tab");
  return isAdminTabId(currentTab) ? currentTab : fallback;
};

export default function AdminPageShell({
  pages,
  tabs,
  defaultTabId = DEFAULT_ADMIN_TAB,
}: AdminPageShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialTab = useMemo(
    () =>
      getTabFromParams(
        new URLSearchParams(searchParams.toString()),
        defaultTabId,
      ),
    [searchParams, defaultTabId],
  );

  const [activeTab, setActiveTab] = useState<AdminTabId>(initialTab);

  useEffect(() => {
    const nextTab = getTabFromParams(
      new URLSearchParams(searchParams.toString()),
      defaultTabId,
    );
    setActiveTab(nextTab);
  }, [searchParams, defaultTabId]);

  const handleTabChange = (tabId: AdminTabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    const nextUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-64 p-4">
        <AdminTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex-1">
        <PageSwitcher
          pages={pages}
          defaultPageId={defaultTabId}
          activePageId={activeTab}
        />
      </div>
    </div>
  );
}
