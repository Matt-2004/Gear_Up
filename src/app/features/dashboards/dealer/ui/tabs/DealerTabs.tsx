"use client";

import clsx from "clsx";
import {
  CalendarCheck,
  Car,
  DollarSign,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ITab {
  name: string;
  path: string;
}

const tabIcons: Record<string, React.ReactNode> = {
  "Dashboard": <LayoutDashboard className="h-4 w-4" />,
  "Car Management": <Car className="h-4 w-4" />,
  "Post Management": <FileText className="h-4 w-4" />,
  "Test Drive Management": <CalendarCheck className="h-4 w-4" />,
  "Revenue Management": <DollarSign className="h-4 w-4" />,
  "Setting": <Settings className="h-4 w-4" />,
};

interface ITabProps {
  tabs: ITab[];
}

export const DealerTabs = ({ tabs }: ITabProps) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const strToUrl = (tabName: string) => {
    return (
      tabName.toLocaleLowerCase().split(" ")[0] +
      "-" +
      tabName.toLocaleLowerCase().split(" ")[1]
    );
  };

  const defaultTab = tabs[0]?.path.replace("?", "").split("=")[1] ?? "dashboard";
  const activeTab = searchParams.get("tab") ?? defaultTab;

  const handleTab = (tabPath: string) => {
    router.replace(`${path}${tabPath}`);
  };

  return (
    <div className="w-full bg-white">
      <nav className="flex overflow-x-auto hide-scrollbar scroll-smooth" aria-label="Tabs">
        {tabs.map((tab) => {
          const tabKey = tab.path.replace("?", "").split("=")[1] ?? strToUrl(tab.name);
          const isActive = activeTab === tabKey;
          
          return (
            <button
              key={tab.name}
              onClick={() => handleTab(tab.path)}
              className={clsx(
                "group relative min-w-fit flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all hover:bg-gray-50",
                isActive
                  ? "text-primary-700 bg-primary-50/30"
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={clsx(
                "transition-transform",
                isActive ? "text-primary-600 scale-110" : "text-gray-500 group-hover:text-gray-700"
              )}>
                {tabIcons[tab.name]}
              </span>
              <span className="whitespace-nowrap">{tab.name}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
