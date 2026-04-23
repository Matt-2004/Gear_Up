"use client";

import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { clearSessionAccessToken } from "@/app/shared/utils/AuthUtils/clientTokenUtils";
import clsx from "clsx";
import {
  CalendarDays,
  CarFront,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Newspaper,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getPrimaryNavbarLinks } from "../utils/navbar-links";

function getAppointmentPath(role?: string) {
  if (!role) return undefined;
  return role === "Dealer"
    ? "/profile/dealer/appointments"
    : "/profile/user/appointments";
}

function getMobileIcon(linkId: string) {
  if (linkId === "home") return <Home className="h-4 w-4" />;
  if (linkId === "cars") return <CarFront className="h-4 w-4" />;
  if (linkId === "discover") return <Newspaper className="h-4 w-4" />;
  if (linkId === "appointments") return <CalendarDays className="h-4 w-4" />;
  return <Home className="h-4 w-4" />;
}

export default function NavbarBrand() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="z-20 flex h-full shrink-0 items-center gap-2">
      <button
        className="cursor-pointer rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200 md:hidden"
        aria-label="Toggle menu"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <Link
        href="/"
        className="flex h-full items-center justify-center transition-transform hover:scale-[1.02]"
      >
        <Image
          src="/logo_dark.png"
          priority
          alt="Gear Up Logo"
          width={108}
          height={40}
          className="h-9 w-auto object-contain sm:h-10"
        />
      </Link>

      {isMobileMenuOpen && (
        <NavbarMobileDrawer onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}

function NavbarMobileDrawer({ onClose }: { onClose: () => void }) {
  const { user, refreshUserData } = useUserData();
  const { addToastMessage } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const appointmentPath = getAppointmentPath(user?.role);
  const links = useMemo(
    () => getPrimaryNavbarLinks(appointmentPath),
    [appointmentPath],
  );

  const profilePath = user
    ? user.role === "Dealer"
      ? "/profile/dealer"
      : "/profile/user"
    : undefined;

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const signOut = async () => {
    try {
      await fetch("/api/token/remove", { method: "POST" });
      clearSessionAccessToken();
      await refreshUserData();
      addToastMessage("success", "Logged out successfully.");
      router.push("/");
      onClose();
    } catch (error) {
      addToastMessage("error", "Failed to log out. Please try again.");
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside className="fixed top-0 left-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col border-r border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-semibold text-gray-900">
            Navigation
          </span>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.username}
            </p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);

              return (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavigate(link.href)}
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {getMobileIcon(link.id)}
                    {link.label}
                  </button>
                </li>
              );
            })}

            {user && profilePath && (
              <li>
                <button
                  onClick={() => handleNavigate(profilePath)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
              </li>
            )}

            {user && (
              <li>
                <button
                  onClick={() => handleNavigate("/messages")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <MessageCircle className="h-4 w-4" />
                  Messages
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className="border-t border-gray-200 px-3 py-3">
          {user ? (
            <button
              onClick={signOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate("/auth/login")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                <LogIn className="h-4 w-4" />
                Log In
              </button>
              <button
                onClick={() => handleNavigate("/auth/register")}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
