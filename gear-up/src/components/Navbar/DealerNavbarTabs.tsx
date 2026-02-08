"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DealerNavbarTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedTabRef = useRef("dashboard");
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    // Set active tab based on current path
    if (pathname.includes("/profile/dealer")) {
      selectedTabRef.current = "dashboard";
    } else if (pathname.includes("/profile/dealer/cars")) {
      selectedTabRef.current = "cars inventory";
    } else if (pathname.includes("/post/discover")) {
      selectedTabRef.current = "discover";
    } else if (pathname.includes("/profile/dealer/appointments")) {
      selectedTabRef.current = "appointments";
    } else {
      selectedTabRef.current = "dashboard";
    }
  }, [pathname]);

  useEffect(() => {
    // Fetch pending appointments count
    // In production, this would call: dealerAppointments() from FetchAPI
    // Example data for demonstration
    const fetchAppointmentCount = async () => {
      try {
        // const data = await dealerAppointments();
        // const pendingCount = data.filter((apt: any) => apt.status === 'Pending').length;
        // setAppointmentCount(pendingCount);

        // Example data fallback
        setAppointmentCount(0);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointmentCount(0);
      }
    };

    fetchAppointmentCount();
  }, []);

  const handleTabSelection = (tabId: string, path: string) => {
    selectedTabRef.current = tabId;
    router.push(path);
  };

  const dealerTabs = [
    { id: "dashboard", label: "Dashboard", path: "/profile/dealer" },
    {
      id: "cars inventory",
      label: "Cars Inventory",
      path: "/profile/dealer/cars",
    },
    {
      id: "appointments",
      label: "Appointments",
      path: "/profile/dealer/appointments",
    },
    { id: "discover", label: "Discover", path: "/post/discover" },
  ];

  return (
    <div
      className={clsx(
        "border-gray-300 mt-12 border-t transition-all duration-300 ease-in-out sm:m-0 sm:border-none md:flex",
      )}
    >
      <div className="flex h-screen w-full font-normal sm:h-16 sm:flex-row">
        <ol className="flex w-full flex-col gap-0 sm:gap-1 md:flex-row md:gap-1">
          {dealerTabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => handleTabSelection(tab.id, tab.path)}
              className={clsx(
                "relative flex cursor-pointer items-center justify-center border-b-2 px-5 py-2 text-sm font-medium text-center transition-all duration-200 ease-in-out sm:border-none sm:rounded-lg",
                "hover:bg-gray-100 hover:text-primary-600",
                selectedTabRef.current === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600",
              )}
            >
              <span>{tab.label}</span>
              {tab.id === "appointments" && appointmentCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                  {appointmentCount}
                </span>
              )}
              {selectedTabRef.current === tab.id && (
                <span className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 rounded-full"></span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
