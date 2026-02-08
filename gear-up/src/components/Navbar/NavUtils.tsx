"use client";

import { IUser } from "@/app/types/user.types";
import clsx from "clsx";
import { Cog, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, useState } from "react";
import { ChatIcon } from "../Common/SVGs";
import { ProfileDropDown } from "./NavbarDropDown";
import NavbarTabs from "./NavbarTabs";

// Be a server side
// pass data through props
// use getServerSideProps to fetch data before render and pass through data

export function Logo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="z-20 flex h-full items-center gap-2 shrink-0">
      <button
        className="cursor-pointer rounded-lg p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        <Menu
          className="text-primary h-6 w-6"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {isMobileMenuOpen && (
          <div className="">
            <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </div>
        )}
      </button>
      <Link
        href="/"
        className="flex h-14 w-28 items-center transition-transform hover:scale-105"
      >
        <Image
          src="/logo.png"
          priority
          alt="Gear Up Logo"
          width={150}
          height={150}
          className="object-contain"
        />
      </Link>
    </div>
  );
}

export function MobileMenu({
  setIsMobileMenuOpen,
}: {
  setIsMobileMenuOpen: Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className="bg-background fixed top-0 left-0 z-50 flex h-screen w-[85%] max-w-sm flex-col text-white shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-primary text-lg font-semibold">Menu</h2>
            <button
              className="rounded-lg p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <X
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="text-primary h-5 w-5"
              />
            </button>
          </div>
          <div className="p-4">
            <NavbarTabs />
          </div>
        </div>
      </div>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

export function User({ user }: { user: IUser }) {
  const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] =
    useState<boolean>(false);

  const { avatarUrl, username, role }: Partial<IUser> = user;

  return (
    <div
      className="relative flex h-full items-center justify-end gap-3 group"
      onMouseEnter={() => {
        setIsOpenUserProfileMenu(true);
      }}
      onMouseLeave={() => {
        setIsOpenUserProfileMenu(false);
      }}
    >
      <div className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="relative">
          <Image
            src={avatarUrl || "/default_profile.jpg"}
            alt="Profile Picture"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full border-2 border-gray-200 object-cover group-hover:border-blue-400 transition-colors"
          />
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
        <div className="hidden md:flex md:flex-col items-start">
          <span className="text-sm text-gray-900 font-medium whitespace-nowrap">
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
      </div>
      {isOpenUserProfileMenu && <ProfileDropDown user={user} />}
    </div>
  );
}

export function SearchBar() {
  const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="relative h-full w-full max-w-md transition-all duration-200 ease-in-out">
      <input
        type="text"
        placeholder="Search cars, posts, dealers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={clsx(
          isSearchBarActive ? "block" : "hidden",
          "w-full rounded-lg bg-gray-50 border border-gray-200 py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all md:block hover:bg-gray-100",
        )}
      />
      <button
        onClick={() => setIsSearchBarActive(true)}
        className={clsx(
          isSearchBarActive
            ? "left-3"
            : "rounded-lg p-2 hover:bg-gray-100 md:bg-transparent md:p-0",
          "absolute top-1/2 -translate-y-1/2 transform transition-colors md:left-3",
        )}
        aria-label="Search"
      >
        <Search
          className={clsx(
            isSearchBarActive ? "text-gray-400" : "text-primary",
            "h-5 w-5",
          )}
        />
      </button>
      {isSearchBarActive && (
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2 transform hover:bg-gray-200 rounded p-1 transition-colors md:hidden"
          onClick={() => {
            setIsSearchBarActive(false);
            setSearchQuery("");
          }}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}

export function Chat() {
  return <ChatIcon />;
}

export function Login() {
  return (
    <Link href="/auth/login" className="shrink-0">
      <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95">
        Login
      </button>
    </Link>
  );
}
