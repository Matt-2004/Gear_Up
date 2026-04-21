"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useUserData } from "@/Context/UserDataContext";
import { getPrimaryNavbarLinks } from "./navbar-links";

function getAppointmentPath(role?: string) {
  if (!role) return undefined;
  return role === "Dealer"
    ? "/profile/dealer/appointments"
    : "/profile/user/appointments";
}

export default function NavbarTabs() {
  const pathname = usePathname();
  const { user } = useUserData();

  const appointmentPath = getAppointmentPath(user?.role);
  const tabs = useMemo(
    () => getPrimaryNavbarLinks(appointmentPath),
    [appointmentPath],
  );

  return (
    <nav aria-label="Primary" className={clsx("hidden md:block")}>
      <ol className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

          return (
            <li key={tab.id} className="flex">
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
