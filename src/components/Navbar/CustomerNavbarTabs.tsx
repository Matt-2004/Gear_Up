"use client";

import { useUserData } from "@/Context/UserDataContext";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerNavbarTabs() {
  const { user } = useUserData();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState("home");

  useEffect(() => {
    // Set active tab based on current path
    if (pathname === "/" || pathname.includes("/home")) {
      setSelectedTab("home");
    } else if (pathname.includes("/discover") || pathname.includes("/post")) {
      setSelectedTab("discover");
    } else if (pathname.includes("/profile/user/appointments")) {
      setSelectedTab("appointments");
    }
  }, [pathname]);

  const handleTabSelection = (tabId: string, path: string) => {
    setSelectedTab(tabId);
    router.push(path);
  };

  const customerTabs = [
    { id: "home", label: "Home", path: "/" },
    { id: "discover", label: "Discover", path: "/post/discover" },
    ...(user
      ? [
        {
          id: "appointments",
          label: "Appointments",
          path: "/profile/user/appointments",
        },
      ]
      : []),
  ];

  return (
    <div
      className={clsx(
        "border-gray-300 mt-12 border-t transition-all duration-300 ease-in-out sm:m-0 sm:border-none md:flex",
      )}
    >
      <div className="flex h-screen w-full font-normal sm:h-16 sm:flex-row">
        <ol className="flex w-full flex-col gap-0 sm:gap-1 md:flex-row md:gap-1">
          {customerTabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => handleTabSelection(tab.id, tab.path)}
              className={clsx(
                "relative flex cursor-pointer items-center justify-center border-b-2 px-5 py-2 text-sm font-medium text-center transition-all duration-200 ease-in-out sm:border-none sm:rounded-lg",
                " hover:text-primary-600",
                selectedTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600",
              )}
            >
              {tab.label}
              {selectedTab === tab.id && (
                <span className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 rounded-full"></span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
