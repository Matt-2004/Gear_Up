"use client";

import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { clearSessionAccessToken } from "@/app/shared/utils/AuthUtils/clientTokenUtils";
import { CarFront, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarUserMenu() {
  const { user, refreshUserData } = useUserData();
  const { addToastMessage } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const signOut = async () => {
    try {
      await fetch("/api/token/remove", { method: "POST" });
      clearSessionAccessToken();
      await refreshUserData();
      addToastMessage("success", "Logged out successfully.");
      router.push("/");
    } catch {
      addToastMessage("error", "Failed to log out. Please try again.");
    }
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      href: user.role === "Dealer" ? "/profile/dealer" : "/profile/user",
    },
    ...(user.role === "Dealer"
      ? [{ icon: CarFront, label: "My Cars", href: "/profile/dealer/cars" }]
      : []),
    { icon: Settings, label: "Settings", href: "/profile/user" },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100"
      >
        <div className="relative">
          <Image
            src={user.profileImage || "/default_profile.jpg"}
            alt={user.displayName || "Profile"}
            width={34}
            height={34}
            className="h-8 w-8 rounded-full border-2 border-white object-cover ring-1 ring-gray-200"
          />
          <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.displayName}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>

          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4 text-gray-400" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
