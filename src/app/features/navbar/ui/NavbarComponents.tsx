"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useScrollAware } from "../hooks/useScrollAware";

export function NavbarContainer({ children }: { children: ReactNode }) {
  const scrolled = useScrollAware();

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-gray-200/60 bg-white/80 shadow-lg shadow-gray-200/20 backdrop-blur-xl"
          : "border-b border-transparent bg-white/95",
      )}
    >
      <div className="w-full px-4">
        <div
          className={clsx(
            "relative mx-auto flex w-full items-center justify-between gap-3 transition-all duration-300",
            scrolled ? "h-14" : "h-16",
            "lg:w-[90%] xl:w-[75%]",
          )}
        >
          {children}
        </div>
      </div>
    </nav>
  );
}
