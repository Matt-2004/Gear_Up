"use client"


import { useState } from "react";
import { ChatIcon, MagnifyingGlass } from "../SVGs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import NavbarItems from "./NavbarItem";
import { useProfile } from "./useProfile";
import { ProfileDownDown } from "./NavbarDropDown";
import { getRefreshToken } from "@/utils/getRefreshToken";

export function Logo() {
    return (
        <div className="w-40 h-16 items-center flex z-20">
            <Image src={"/logo.png"} priority alt="Logo" width={150} height={150} className="" />
        </div>
    )
}

export function NavUtils() {

    const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);

    useQuery({
        queryKey: ["authenticate"],
        queryFn: async () => {
            const res = await getRefreshToken();
            setIsAuthenticate(res)
            return res
        },
        enabled: true
    })
    return (
        <div className="lg:flex h-full items-center xl:gap-8 lg:gap-6 hidden">
            <NavbarItems>
                <SearchBarIcon />
            </NavbarItems>
            <NavbarItems>
                <Chat />
            </NavbarItems>
            <NavbarItems>
                {isAuthenticate ? <User /> : <Login />}
            </NavbarItems>
        </div>
    )
}

function User() {

    const { data } = useProfile();
    const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] = useState<boolean>(false);

    if (data) {
        const { avatarUrl, name } = data.data;
        return (

            <div className="flex items-center gap-4 cursor-pointer relative" onClick={() => { setIsOpenUserProfileMenu(!isOpenUserProfileMenu) }}>
                <Image src={avatarUrl} alt="Profile Picture" width={40} height={40} className="rounded-full" />
                <span className="text-white font-medium">{name}</span>
                {isOpenUserProfileMenu && <ProfileDownDown />}
            </div>

        )
    }
    if (!data) (
        <div>Fetching Data failed!!</div>
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