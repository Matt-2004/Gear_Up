"use client";

import clsx from "clsx";
import {
  CalendarCheck,
  Car,
  DollarSign,
  FileText,
  Settings,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_DEALER_TAB,
  isDealerTabId,
  type DealerTabId,
} from "@/app/features/dashboards/dealer/utils/dealer-tabs.config";

interface DealerTab {
  id: DealerTabId;
  label: string;
}

interface DealerTabsProps {
  tabs: readonly DealerTab[];
}

const tabIcons: Record<DealerTabId, React.ReactNode> = {
  "car-management": <Car className="h-4 w-4" />,
  "post-management": <FileText className="h-4 w-4" />,
  "appointment-management": <CalendarCheck className="h-4 w-4" />,
  "revenue-management": <DollarSign className="h-4 w-4" />,
  setting: <Settings className="h-4 w-4" />,
};

export const DealerTabs = ({ tabs }: DealerTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab");
  const activeTab = isDealerTabId(currentTab) ? currentTab : DEFAULT_DEALER_TAB;

  const handleTabChange = (tabId: DealerTabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="w-full bg-white">
      <nav
        className="hide-scrollbar flex overflow-x-auto scroll-smooth"
        aria-label="Dealer dashboard tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={clsx(
                "group relative inline-flex min-w-fit flex-1 items-center justify-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all hover:bg-gray-50",
                isActive
                  ? "bg-primary-50/30 text-primary-700"
                  : "text-gray-600 hover:text-gray-900",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={clsx(
                  "transition-transform",
                  isActive
                    ? "scale-110 text-primary-600"
                    : "text-gray-500 group-hover:text-gray-700",
                )}
              >
                {tabIcons[tab.id]}
              </span>

              <span className="whitespace-nowrap">{tab.label}</span>

              {isActive && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary-600" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
