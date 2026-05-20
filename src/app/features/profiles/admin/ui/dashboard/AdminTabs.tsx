"use client";

import clsx from "clsx";
import { ClipboardCheck, LayoutDashboard, UserRoundCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { AdminTabId } from "../../utils/admin-tab.config";

interface AdminTab {
  id: AdminTabId;
  label: string;
}

interface AdminTabsProps {
  tabs: readonly AdminTab[];
  panelTitle?: string;
  description?: string;
  activeTab: AdminTabId;
  onTabChange: (tabId: AdminTabId) => void;
}

const tabIcons: Record<AdminTabId, ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />,
  "kyc-verification": <UserRoundCheck className="h-4 w-4 sm:h-5 sm:w-5" />,
  "car-verification": <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5" />,
};

export const AdminTabs = ({
  tabs,
  panelTitle = "Admin",
  description = "Manage your platform",
  activeTab,
  onTabChange,
}: AdminTabsProps) => {
  return (
    <div>
      {/* Branding */}
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          {panelTitle} Panel
        </h2>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1" aria-label={`${panelTitle} tabs`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={clsx(
                  "shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-105",
                )}
              >
                {tabIcons[tab.id]}
              </span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
