"use client";

import { ReactNode } from "react";

function NavbarContainer({ children }: { children: ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100/80 bg-white/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="relative mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex h-full w-full items-center justify-between gap-3">
          {children}
        </div>
      </div>
    </nav>
  );
}

export default NavbarContainer;
