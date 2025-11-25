"use client";

import { useEffect, useState } from "react";
import { ChatIcon, MagnifyingGlass } from "../Common/SVGs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import NavbarItems from "./NavbarItem";
import { ProfileDownDown } from "./NavbarDropDown";
import { getUserProfile } from "@/utils/FetchAPI";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { handleAuthenticationLogin } from "@/lib/Features/authSlice";
import { getUserProfileRes } from "@/app/types/user.types";
import { useRouter } from "next/navigation";

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

export function NavUtils() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: profile, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 5000,
    retry: false,
    enabled: true,
  });

  useEffect(() => {
    // check the refresh token exist or not
    const tokenCheck = async () => {
      return await getRefreshToken();
    };

    try {
      tokenCheck()
        .then(() => refetch())
        .then(() => dispatch(handleAuthenticationLogin()));
    } catch (err) {
      console.error("Fetching error in NavUtils ", err);
    }

    if (profile.data.role === "Admin") {
      router.push("/profile/admin?tab=dashboard");
    }
  }, []);

  return (
    <div className="lg:flex h-full items-center xl:gap-8 lg:gap-6 hidden">
      <NavbarItems>
        <SearchBarIcon />
      </NavbarItems>
      <NavbarItems>
        <Chat />
      </NavbarItems>
      <NavbarItems>
        {isAuthenticated ? <User profile={profile} /> : <Login />}
      </NavbarItems>
    </div>
  );
}

function User({ profile }: { profile: getUserProfileRes }) {
  const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] =
    useState<boolean>(false);
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
      {isOpenUserProfileMenu && <ProfileDownDown />}
    </div>
  );
}

function SearchBarIcon() {
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

function Chat() {
  return <ChatIcon />;
}

function Login() {
  return (
    <div className="px-6 py-1.5 main-color-gradient cursor-pointer">
      <Link href="/auth/login">
        <button className="font-semibold">Login</button>
      </Link>
    </div>
  );
}
