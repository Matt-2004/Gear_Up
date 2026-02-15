"use client";

import clsx from "clsx";
import {
  BarChart3,
  CalendarCheck,
  Car,
  ClipboardCheck,
  DollarSign,
  FileText,
  LayoutDashboard,
  Settings,
  UserRoundCheck
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface ITab {
  name: string;
  path: string;
}

interface ITabProps {
  name: string;
  tabs: ITab[];
}

const tabIcons: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Kyc Verification": <UserRoundCheck className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Car Verification": <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Generate Report": <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Car Management": <Car className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Post Management": <FileText className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Test Drive Management": <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Revenue Management": <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />,
  "Setting": <Settings className="h-4 w-4 sm:h-5 sm:w-5" />,
};


export const Tabs = ({ name, tabs }: ITabProps) => {
  const router = useRouter();
  const path = usePathname();
  const [selectedTab, setSelectedtab] = useState<string>("dashboard");

  const strToUrl = (tabName: string) => {
    return (
      tabName.toLocaleLowerCase().split(" ")[0] +
      "-" +
      tabName.toLocaleLowerCase().split(" ")[1]
    );
  };

  const handleTab = (tabPath: string, tabName: string) => {
    setSelectedtab(strToUrl(tabName));
    router.replace(`${path}${tabPath}`);
  };

  return (
    <div className="h-full bg-white shadow-sm rounded-2xl p-2 sm:p-4">
      <div className="mb-4 sm:mb-8 p-2 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{name} Panel</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage your platform</p>
      </div>
      <nav className="space-y-1 sm:space-y-2">
        {tabs.map((tab) => {
          const isActive = selectedTab === strToUrl(tab.name);
          return (
            <button
              key={tab.name}
              onClick={() => handleTab(tab.path, tab.name)}
              className={clsx(
                "group flex w-full items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-left font-medium transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <span
                className={clsx(
                  "transition-transform duration-200 shrink-0",
                  isActive ? "scale-110" : "group-hover:scale-110",
                )}
              >
                {tabIcons[tab.name]}
              </span>
              <span className="text-xs sm:text-sm truncate">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

