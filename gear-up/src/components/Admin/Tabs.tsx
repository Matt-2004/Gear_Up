"use client";

import clsx from "clsx";
import {
  BarChart3,
  FileCheck,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface ITab {
  name: string;
  path: string;
}

const tabIcons: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="h-5 w-5" />,
  "Kyc Verification": <FileCheck className="h-5 w-5" />,
  "Dealer Verification": <ShieldCheck className="h-5 w-5" />,
  "Generate Report": <BarChart3 className="h-5 w-5" />,
};

export const Tabs = ({ tabs }: { tabs: ITab[] }) => {
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
    <div className="h-full bg-white shadow-sm rounded-2xl p-4">
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your platform</p>
      </div>
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const isActive = selectedTab === strToUrl(tab.name);
          return (
            <button
              key={tab.name}
              onClick={() => handleTab(tab.path, tab.name)}
              className={clsx(
                "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all duration-200",
                isActive
                  ? "bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <span
                className={clsx(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110",
                )}
              >
                {tabIcons[tab.name]}
              </span>
              <span className="text-sm">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
