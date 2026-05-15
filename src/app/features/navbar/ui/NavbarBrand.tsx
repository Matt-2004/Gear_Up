"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMobileMenu } from "../hooks/useMobileMenu";
import NavbarMobileDrawer from "./NavbarMobileDrawer";

export default function NavbarBrand() {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <div className="z-20 flex h-full shrink-0 items-center gap-3">
      <button
        className="cursor-pointer rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 md:hidden"
        aria-label="Toggle menu"
        onClick={toggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <Link
        href="/"
        className="flex h-16 w-28 items-center justify-center transition-transform hover:scale-[1.02]"
      >
        <Image
          src="/logo_dark.png"
          priority
          alt="Gear Up Logo"
          width={100}
          height={40}
          className="h-auto w-auto object-contain"
        />
      </Link>

      {isOpen && <NavbarMobileDrawer onClose={close} />}
    </div>
  );
}
