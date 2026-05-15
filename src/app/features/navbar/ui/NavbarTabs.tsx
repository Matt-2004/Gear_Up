"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAVBAR_LINKS } from "../constants";

export default function NavbarTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ol className="flex items-center gap-0.5">
        {PRIMARY_NAVBAR_LINKS.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname?.startsWith(`${tab.href}/`));

          return (
            <li key={tab.id}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "relative inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                  isActive
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900",
                  "after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-200 after:content-['']",
                  isActive
                    ? "after:left-2 after:w-[calc(100%-1rem)]"
                    : "hover:after:left-2 hover:after:w-[calc(100%-1rem)]",
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
