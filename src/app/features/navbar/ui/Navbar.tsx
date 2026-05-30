"use client";

import { usePathname } from "next/navigation";
import NavbarUtility from "@/app/features/navbar/ui/NavbarUtility";
import NavbarBrand from "./NavbarBrand";
import { NavbarContainer } from "./NavbarComponents";
import NavbarTabs from "./NavbarTabs";
import { useUserData } from "../context/UserDataContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUserData();
  const isLanding = pathname === "/";
  const isBrowse = pathname.startsWith("/car/search");
  const hideTabsAndSearch = isLanding || (isBrowse && !user);

  return (
    <NavbarContainer>
      {/* Left: Brand */}
      <NavbarBrand />

      {/* Center: Navigation links */}
      {!hideTabsAndSearch && (
        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <NavbarTabs />
        </div>
      )}

      {/* Right: Search, Wishlist, Notifications, Auth, CTA */}
      <NavbarUtility showSearch={!hideTabsAndSearch} />
    </NavbarContainer>
  );
}
