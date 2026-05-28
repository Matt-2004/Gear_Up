"use client";

import { usePathname } from "next/navigation";

export default function GlobalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-white/5 bg-black py-4">
      <div className="mx-auto flex w-full items-center justify-between px-4 text-xs text-gray-500 lg:w-[90%] xl:w-[75%]">
        <span>&copy; {new Date().getFullYear()} Gear Up. All rights reserved.</span>
        <span>Thailand&apos;s most trusted car marketplace</span>
      </div>
    </footer>
  );
}
