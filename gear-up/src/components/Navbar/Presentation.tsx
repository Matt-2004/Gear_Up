import { usePopup } from "@/provider/NavbarContext";
import { ReactNode, useState } from "react";
import { ChatIcon, MagnifyingGlass, MenuBar, XIcon } from "../SVGs";
import clsx from "clsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/utils/FetchAPI";
import Link from "next/link";
import Input from "../Input";
import { useFormData } from "@/app/hooks/useFormData";
import { signOut } from "next-auth/react"
import Image from "next/image";
import { userProfileResponse } from "@/app/types/api.types";
import NavbarItems from "./NavbarItem";
import { userProfile } from "./useProfile";
import { ProfileDownDown } from "./NavbarDropDown";

export function Logo() {
    return (
        <div className="w-40 h-16 items-center flex z-20">
            <Image src={"/Gear.png"} priority alt="Logo" width={150} height={150} className="" />
        </div>
    )
}

export function NavUtils() {
    const profile = userProfile();

    return (
        <div className="lg:flex h-full items-center xl:gap-8 lg:gap-6 hidden">
            <NavbarItems>
                <SearchBarIcon />
            </NavbarItems>
            <NavbarItems>
                <Chat />
            </NavbarItems>
            <NavbarItems>
                {profile ? <User profile={profile} /> : <Login />}
            </NavbarItems>
        </div>
    )
}

function User({ profile }: { profile: userProfileResponse }) {

    const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] = useState<boolean>(false);
    const { avatarUrl, name } = profile.data

    return (

        <div className="flex items-center gap-4 cursor-pointer relative" onClick={() => { setIsOpenUserProfileMenu(!isOpenUserProfileMenu) }}>
            <Image src={avatarUrl} alt="Profile Picture" width={40} height={40} className="rounded-full" />
            <span className="text-white font-medium">{name}</span>
            {isOpenUserProfileMenu && <ProfileDownDown />}
        </div>

    )
}

function SearchBarIcon() {

    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

    return (
        <div className="relative">
            <div id="search-bar-icon" onClick={() => { setIsSearchOpen(true) }} className="text-white cursor-pointer ">
                <MagnifyingGlass />
            </div>
            {
                isSearchOpen &&
                <div className="absolute top-11 right-0" onBlur={() => setIsSearchOpen(false)}>
                    <input type="text" placeholder="Search..." autoFocus className="w-80 placeholder:text-sm placeholder:text-gray-500 focus:border-[#7ED957] bg-white text-black font-medium border-black border rounded px-2 py-[6px] outline-none" />
                </div>
            }
        </div>
    )

}

function Chat() {
    return (
        <ChatIcon />
    )
}

function Login() {

    return (
        <div className="px-6 py-1.5 main-color-gradient cursor-pointer">
            <Link href="/auth/login"><button className="font-semibold">Login</button></Link>
        </div>
    )

}