"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarTabs() {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("home");

  const handleTabSelection = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const tabs = ["home", "cars", "discover", "contact"];

  return (
    <>
      <div
        className={clsx(
          "border-gray-300 mt-12 border-t transition-all duration-300 ease-in-out sm:m-0 sm:border-none md:flex ",
        )}
      >
        <div className="flex h-screen w-full  font-normal sm:h-16 sm:flex-row md:px-1 md:py-1">
          <ol className="flex w-full flex-col gap-0 sm:gap-2 md:flex-row md:gap-2 lg:gap-4">
            {tabs.map((tab) => (
              <li
                key={tab}
                onClick={() => {
                  handleTabSelection(tab);
                }}
                className={clsx(
                  "flex cursor-pointer items-center justify-center border-b-2  px-4 py-2 text-center transition-all duration-300 ease-in-out hover:border-primary-600 hover:text-primary-600 sm:border-none",
                  selectedTab === tab
                    ? "border-primary-600 text-primary-600 font-medium"
                    : "border-transparent text-gray-600",
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
