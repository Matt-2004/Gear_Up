import Image from "next/image";
import { ChatIcon, EyeIcon, MagnifyingGlass, MenuBar, XIcon } from "./SVGs";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

export default function Title() {
    return (
        <div className=" relative w-full  border-[#7ED957] border-b h-16 flex justify-center bg-[#142030]">

            <div className="z-20 xl:w-[75%] w-[90%] items-center flex justify-between h-16 object-fill ">
                <div className="w-40 h-16 items-center flex z-20">

                    <Image src={"/Gear.png"} priority alt="Logo" width={150} height={200} className="object-contain " />
                </div>
                <NavbarTabs />
                <UtilityBar />

            </div>
        </div>
    )
}

function NavbarTabs() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    return (

        <>
            <div className={clsx("absolute left-0 top-0 max-sm:z-10", isMenuOpen ? "h-screen flex" : "h-0 hidden", "lg:static lg:w-auto lg:flex transition-all duration-300 ease-in-out")}>
                <ol className="lg:gap-8 xl:gap-12 gap-10 flex items-center  max-sm:flex-col  max-sm:w-screen max-sm:h-screen  justify-center  text-xl  bg-[#142030] font-medium text-white">
                    <li className="cursor-pointer text-[16px]  md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Home</li>
                    <li className="cursor-pointer text-[16px] md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Promotions</li>
                    <li className="cursor-pointer text-[16px] md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Buy Cars</li>
                    <li className="cursor-pointer text-[16px] md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Rent Cars</li>
                    <li className="cursor-pointer text-[16px]  md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Contact Me</li>
                </ol>
            </div>
            <div id="menu-bar" onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex z-20 items-center justify-center lg:hidden">
                {isMenuOpen && <XIcon />}
                {!isMenuOpen && <MenuBar />}
            </div>
        </>
    )
}

function UtilityBar() {
    return (
        <div className="lg:flex h-full items-center xl:gap-8 lg:gap-6 hidden">
            <SearchBarIcon />
            <Chat />
            <Login />
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
        <div >
            <ChatIcon />
        </div>
    )
}

function Login() {
    return (
        <div className="px-6 py-1.5 main-color-gradient cursor-pointer">
            <Link href="/auth/login"><button className="text-black font-semibold">Login</button></Link>

        </div>
    )
}



