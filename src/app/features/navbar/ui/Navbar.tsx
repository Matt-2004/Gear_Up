"use client";

import NavbarUtility from "@/app/features/navbar/ui/NavbarUtility";
import NavbarBrand from "./NavbarBrand";
import { NavbarContainer } from "./NavbarComponents";
import NavbarTabs from "./NavbarTabs";

export default function Navbar() {
  return (
    <NavbarContainer>
      <div className="flex h-full items-center gap-3">
        <NavbarBrand />
      </div>

      <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
        <NavbarTabs />
      </div>

      <NavbarUtility />
    </NavbarContainer>
  );
}
