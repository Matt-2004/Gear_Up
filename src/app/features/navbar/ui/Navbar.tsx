"use client";

import NavbarUtility from "@/app/features/navbar/ui/NavbarUtility";
import NavbarBrand from "./NavbarBrand";
import { NavbarContainer } from "./NavbarComponents";
import NavbarTabs from "./NavbarTabs";

export default function Navbar() {
  return (
    <NavbarContainer>
      {/* Left: Brand */}
      <NavbarBrand />

      {/* Center: Navigation links */}
      <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
        <NavbarTabs />
      </div>

      {/* Right: Search, Wishlist, Notifications, Auth, CTA */}
      <NavbarUtility />
    </NavbarContainer>
  );
}
