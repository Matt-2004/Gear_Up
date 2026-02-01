"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerNavbarTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState("home");

  useEffect(() => {
    // Set active tab based on current path
    if (pathname === "/" || pathname.includes("/home")) {
      setSelectedTab("home");
    } else if (pathname.includes("/car")) {
      setSelectedTab("cars");
    } else if (pathname.includes("/discover") || pathname.includes("/post")) {
      setSelectedTab("discover");
    } else if (pathname.includes("/contact")) {
      setSelectedTab("contact");
    }
  }, [pathname]);

  const handleTabSelection = (tabId: string, path: string) => {
    setSelectedTab(tabId);
    router.push(path);
  };

  const customerTabs = [
    { id: "home", label: "Home", path: "/" },
    { id: "cars", label: "Cars", path: "/car" },
    { id: "discover", label: "Discover", path: "/post/discover" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  return (
    <div
      className={clsx(
        "border-gray-300 mt-12 border-t transition-all duration-300 ease-in-out sm:m-0 sm:border-none md:flex",
      )}
    >
      <div className="flex h-screen w-full font-normal sm:h-16 sm:flex-row md:px-1 md:py-1">
        <ol className="flex w-full flex-col gap-0 sm:gap-2 md:flex-row md:gap-2 lg:gap-4">
          {customerTabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => handleTabSelection(tab.id, tab.path)}
              className={clsx(
                "flex cursor-pointer items-center justify-center border-b-2 px-4 py-2 text-center transition-all duration-300 ease-in-out hover:border-primary-600 hover:text-primary-600 sm:border-none",
                selectedTab === tab.id
                  ? "border-primary-600 text-primary-600 font-medium"
                  : "border-transparent text-gray-600",
              )}
            >
              {tab.label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
