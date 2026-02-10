"use client";

import { ReactNode } from "react";

function NavbarContainer({ children }: { children: ReactNode }) {
  return (
    <nav className=" sticky top-0 z-50 w-full border-b bg-white border-gray-200 shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="relative flex h-16 max-h-full max-w-screen justify-center">
        <div className="z-20 px-4 flex h-full w-full items-center justify-between gap-4 lg:w-[90%] xl:w-[75%]">
          {children}
        </div>
      </div>
    </nav>
  );
}

export default NavbarContainer;
