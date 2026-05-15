"use client";

import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { clearSessionAccessToken } from "@/app/shared/utils/AuthUtils/clientTokenUtils";
import clsx from "clsx";
import {
  LogIn,
  LogOut,
  MessageCircle,
  Newspaper,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MOBILE_LINK_ICONS,
  PRIMARY_NAVBAR_LINKS,
  SECONDARY_MOBILE_LINKS,
} from "../constants";

interface NavbarMobileDrawerProps {
  onClose: () => void;
}

export default function NavbarMobileDrawer({
  onClose,
}: NavbarMobileDrawerProps) {
  const { user, refreshUserData } = useUserData();
  const { addToastMessage } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path: string) => {
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
    } catch {
      addToastMessage("error", "Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed top-0 left-0 z-50 flex h-dvh w-[88%] max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-left-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex h-12 w-24 items-center justify-center"
          >
            <Image
              src="/logo_dark.png"
              alt="Gear Up Logo"
              width={90}
              height={36}
              className="h-auto w-auto object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="mx-4 mb-2 flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
            <Image
              src={user.profileImage || "/default_profile.jpg"}
              alt={user.displayName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        {/* Primary links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {PRIMARY_NAVBAR_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
              const Icon = MOBILE_LINK_ICONS[link.id] ?? User;

              return (
                <li key={link.id}>
                  <button
                    onClick={() => navigate(link.href)}
                    className={clsx(
                      "flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </button>
                </li>
              );
            })}

            {/* Secondary links (auth-only) */}
            {user && (
              <>
                <li className="mt-3 border-t border-gray-100 pt-3" />
                {SECONDARY_MOBILE_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {link.id === "discover" && (
                        <Newspaper className="h-5 w-5" />
                      )}
                      {link.id === "messages" && (
                        <MessageCircle className="h-5 w-5" />
                      )}
                      {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() =>
                      navigate(
                        user.role === "Dealer"
                          ? "/profile/dealer"
                          : "/profile/user",
                      )
                    }
                    className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="border-t border-gray-100 px-4 py-4 space-y-2">
          {user ? (
            <button
              onClick={signOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth/login")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
