"use client";

import { useState } from "react";
import { ChatIcon, MagnifyingGlass } from "../Common/SVGs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ProfileDownDown } from "./NavbarDropDown";
import { getUserProfile } from "@/utils/FetchAPI";

// Be a server side
// pass data through props
// use getServerSideProps to fetch data before render and pass through data

export function Logo() {
  return (
    <div className="w-40 h-16 items-center flex z-20">
      <Image
        src={"/logo.png"}
        priority
        alt="Logo"
        width={150}
        height={150}
        className=""
      />
    </div>
  );
}

export function User() {
  const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] =
    useState<boolean>(false);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 5000,
    retry: false,
    enabled: true,
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (profile) {
    const { avatarUrl, name } = profile.data;
    return (
      <div
        className="flex items-center gap-4 cursor-pointer relative"
        onClick={() => {
          setIsOpenUserProfileMenu(!isOpenUserProfileMenu);
        }}
      >
        <Image
          src={avatarUrl}
          alt="Profile Picture"
          width={40}
          height={40}
          className="rounded-full"
        ></Image>
        <span className="text-white font-medium">{name}</span>
        {isOpenUserProfileMenu && <ProfileDownDown user={profile} />}
      </div>
    );
  }
}

export function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <div
        id="search-bar-icon"
        onClick={() => {
          setIsSearchOpen(true);
        }}
        className="text-white cursor-pointer "
      >
        <MagnifyingGlass />
      </div>
      {isSearchOpen && (
        <div
          className="absolute top-11 right-0"
          onBlur={() => setIsSearchOpen(false)}
        >
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            className="w-80 placeholder:text-sm placeholder:text-gray-500 focus:border-[#7ED957] bg-white text-black font-medium border-black border rounded px-2 py-[6px] outline-none"
          />
        </div>
      )}
    </div>
  );
}

export function Chat() {
  return <ChatIcon />;
}

export function Login() {
  return (
    <div className="px-6 py-1.5 main-color-gradient cursor-pointer">
      <Link href="/auth/login">
        <button className="font-semibold">Login</button>
      </Link>
    </div>
  );
}
