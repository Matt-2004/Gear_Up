"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ChatIcon, MagnifyingGlass } from "../Common/SVGs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ProfileDownDown } from "./NavbarDropDown";
import { getUserProfile } from "@/utils/FetchAPI";
import { Cog, Menu, X } from "lucide-react";
import NavbarTabs from "./NavbarTabs";
import { div } from "framer-motion/client";


// Be a server side
// pass data through props
// use getServerSideProps to fetch data before render and pass through data

export function Logo() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="w-32 h-16 items-center flex z-20">
      <div className="hover:bg-gray-600 p-1 rounded-md cursor-pointer active:bg-gray-600">
        <Menu className="text-white md:hidden text-2xl h-7 w-7" onClick={() => setIsMobileMenuOpen(prev => !prev)} />

        {isMobileMenuOpen && (
          <div className="">

            <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </div>
        )}

      </div>
      <div className="-translate-x-2 w-32 h-16 flex items-center">

        <Image
          src={"/logo.png"}
          priority
          alt="Logo"
          width={150}
          height={150}
          className="object-contain "
        />
      </div>
    </div>
  );
}

export function MobileMenu({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <>
      <div className="fixed top-0 w-[75%] h-screen left-0  bg-background text-white flex flex-col z-40">
        <div className="relative  flex flex-col gap-8">
          <div className="absolute top-5 right-4">
            <X onClick={() => setIsMobileMenuOpen(prev => !prev)} />
          </div>

          <NavbarTabs />
        </div>


      </div>
      <div className="fixed inset-0 bg-gradient-to-r from-gray-900/60 to-black/80 z-30" />
    </>
  )
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
    const { avatarUrl, name, role } = profile.data;
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
        <h1>

          <span className="text-white font-medium">{name}</span>
          {
            role === "Dealer" &&
            <div className="text-gray-800 bg-primary rounded-full text-center text-sm flex gap-1 items-center px-2"><Cog className="h-4 w-4" />{role}</div>
          }
        </h1>
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
          className="absolute top-10 right-0"
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
