"use client";

import clsx from "clsx";
import {
  BarChart3,
  ClipboardCheck,
  LayoutDashboard,
  UserRoundCheck,
} from "lucide-react";
import { ReactNode } from "react";
import { type AdminTabId } from "../../utils/admin-tab.config";

interface AdminTab {
  id: AdminTabId;
  label: string;
}

interface AdminTabProps {
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
}: AdminTabProps) => {
  return (
    <div className="h-full bg-white p-2 sm:p-4">
      <div className="mb-4 p-2 sm:mb-8 sm:p-4">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          {panelTitle} Panel
        </h2>

        <p className="mt-1 text-xs text-gray-600 sm:text-sm">{description}</p>
      </div>

      <nav className="space-y-1 sm:space-y-2" aria-label={`${panelTitle} tabs`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "group flex w-full cursor-pointer items-center gap-2 px-2 py-2 text-left font-medium transition-all duration-200 sm:gap-3 sm:px-4 sm:py-3",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={clsx(
                  "shrink-0 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110",
                )}
              >
                {tabIcons[tab.id]}
              </span>

              <span className="truncate text-xs sm:text-sm">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
