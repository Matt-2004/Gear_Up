"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DealerNavbarTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedTabRef = useRef("dashboard");
  const [, forceUpdate] = useState({});
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    // Set active tab based on current path
    if (pathname.includes("/profile/dealer")) {
      selectedTabRef.current = "dashboard";
    } else if (pathname.includes("/car")) {
      selectedTabRef.current = "inventory";
    } else if (pathname.includes("/discover")) {
      selectedTabRef.current = "discover";
    } else if (pathname.includes("/appointments")) {
      selectedTabRef.current = "appointments";
    } else {
      selectedTabRef.current = "dashboard";
    }
    forceUpdate({});
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
    forceUpdate({});
    router.push(path);
  };

  const dealerTabs = [
    { id: "dashboard", label: "Dashboard", path: "/profile/dealer" },
    { id: "inventory", label: "Inventory", path: "/car" },
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
      <div className="flex h-screen w-full font-normal sm:h-16 sm:flex-row md:px-1 md:py-1">
        <ol className="flex w-full flex-col gap-0 sm:gap-2 md:flex-row md:gap-2 lg:gap-4">
          {dealerTabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => handleTabSelection(tab.id, tab.path)}
              className={clsx(
                "flex cursor-pointer items-center justify-center border-b-2 px-4 py-2 text-center transition-all duration-300 ease-in-out hover:border-primary-600 hover:text-primary-600 sm:border-none relative",
                selectedTabRef.current === tab.id
                  ? "border-primary-600 text-primary-600 font-medium"
                  : "border-transparent text-gray-600",
              )}
            >
              {tab.label}
              {tab.id === "appointments" && appointmentCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {appointmentCount}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
