"use client";

import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import NavbarSearch from "./NavbarSearch";
import NavbarNotificationBell from "./NavbarNotificationBell";
import NavbarUserMenu from "./NavbarUserMenu";
import NavbarLoginButton from "./NavbarLoginButton";

export default function NavbarUtility() {
  const { user } = useUserData();

  return (
    <div className="flex shrink-0 items-center gap-1 md:gap-2">
      <NavbarSearch />

      {user && <NavbarNotificationBell />}

      {user ? <NavbarUserMenu /> : <NavbarLoginButton />}
    </div>
  );
}
