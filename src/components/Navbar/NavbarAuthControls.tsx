"use client";

import { useUserData } from "@/Context/UserDataContext";
import { Cog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProfileDropDown } from "./NavbarDropDown";

export function NavbarUserMenu() {
  const { user } = useUserData();
  const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] =
    useState<boolean>(false);

  if (!user) return null;

  const { avatarUrl, username, role } = user;

  return (
    <div
      className="group relative flex h-full items-center justify-end"
      onMouseEnter={() => setIsOpenUserProfileMenu(true)}
      onMouseLeave={() => setIsOpenUserProfileMenu(false)}
    >
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
      >
        <div className="relative">
          <Image
            src={avatarUrl || "/default_profile.jpg"}
            alt="Profile Picture"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full border-2 border-gray-200 object-cover transition-colors group-hover:border-blue-400"
          />
          <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        </div>
        <div className="hidden items-start md:flex md:flex-col">
          <span className="text-sm font-medium whitespace-nowrap text-gray-900">
            {username &&
              username.charAt(0).toUpperCase() + username.substring(1)}
          </span>
          {role === "Dealer" && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Cog className="h-3 w-3" />
              <span>{role}</span>
            </div>
          )}
        </div>
      </button>
      {isOpenUserProfileMenu && <ProfileDropDown />}
    </div>
  );
}

export function NavbarLoginButton() {
  return (
    <Link href="/auth/login" className="shrink-0">
      <button className="bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 sm:px-5">
        Sign In
      </button>
    </Link>
  );
}
