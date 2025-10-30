import Image from "next/image";
import { ChatIcon, EyeIcon, MagnifyingGlass, MenuBar, XIcon } from "./SVGs";
import { useContext, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { TitleContentProvider, usePopup } from "@/provider/TitleContext";
import { useFormData } from "@/app/hooks/useFormData";
import Input from "./Input";
import { getUserProfile } from "@/utils/FetchAPI";
import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/getClientCookie";

export default function Title() {
    return (
        <TitleContentProvider>
            <TitleContainer>
                <Logo />
                <NavMenu />
                <NavUtils />
            </TitleContainer>
        </TitleContentProvider>

    )
}

function TitleContainer({ children }: { children: React.ReactNode }) {
    const { isOpen } = usePopup();
    return (
        <>
            <div className=" relative w-full  border-[#7ED957] border-b h-16 flex justify-center bg-[#142030]">
                <div className="z-20 xl:w-[75%] w-[90%] items-center flex justify-between h-16 object-fill ">
                    {children}
                </div>
            </div>
            {isOpen && <SettingPopup />}
        </>
    )
}

function Logo() {
    return (
        <div className="w-40 h-16 items-center flex z-20">
            <Image src={"/Gear.png"} priority alt="Logo" width={150} height={150} className="" />
        </div>
    )
}

function NavUtils() {


    const access_token = getAccessToken();
    console.log(
        "access_token", access_token);
    // Todo: Need to check if user is logged in or not

    return (
        <div className="lg:flex h-full items-center xl:gap-8 lg:gap-6 hidden">
            <SearchBarIcon />
            <Chat />
            <Login />
            {/* {session ? <Profile /> : <Login />} */}
        </div>
    )
}

// function Profile() {

//     const { data: session } = useSession();
//     const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState<boolean>(false);

//     return (
//         <>
//             <div className="flex items-center gap-4 cursor-pointer relative" onClick={() => { setIsUpdateProfileOpen(!isUpdateProfileOpen) }}>
//                 <Image src={session?.user?.image || "/default-profile.png"} alt="Profile Picture" width={40} height={40} className="rounded-full" />
//                 <span className="text-white font-medium">{session?.user?.name || "User"}</span>
//                 {isUpdateProfileOpen && <UpdateProfile />}
//             </div>
//         </>
//     )
// }

function UpdateProfile() {

    const { openPopup, setTag } = usePopup();

    return (
        <div className="absolute top-12  w-48 bg-white shadow-lg rounded-md p-4 z-30">
            <ul className="space-y-2">
                <li className="cursor-pointer hover:text-[#7ED957]" onClick={() => {
                    setTag("viewProfile");
                    openPopup();
                }}>View Profile</li>
                <li className="cursor-pointer hover:text-[#7ED957]" onClick={() => {
                    setTag("settings");
                    openPopup();
                }}>Settings</li>
                <li onClick={() => signOut()} className="cursor-pointer hover:text-[#7ED957]">Logout</li>
            </ul>
        </div>
    )
}

function SettingPopup() {

    const { closePopup, setTag, tag } = usePopup();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="h-[70%] w-[80%] bg-white shadow-lg rounded-md ">
                <button className="absolute top-6 cursor-pointer right-6 text-gray-600 hover:text-gray-800" onClick={closePopup}>
                    <XIcon />
                </button>
                <div className="flex h-full">
                    <div className="w-1/4 border-r pt-2 pl-2">
                        <ul className="space-y-4">
                            <li className={clsx(tag === "viewProfile" ? "text-[#7ED957]  border border-[#7ED957] bg-[#D6FFC4] " : "text-black", "hover:text-[#7ED957] hover:bg-[#D6FFC4] rounded-lg font-medium w-72 h-10 flex items-center pl-6 cursor-pointer")} onClick={() => setTag("viewProfile")}>View Profile</li>
                            <li className={clsx(tag === "settings" ? "text-[#7ED957]  border border-[#7ED957] bg-[#D6FFC4] " : "text-black", "hover:text-[#7ED957] hover:bg-[#D6FFC4] rounded-lg font-medium w-72 h-10 flex items-center pl-6 cursor-pointer")} onClick={() => setTag("settings")}>Settings</li>
                        </ul>
                    </div>
                    <div className="w-3/4 pl-4">
                        {/* Content area */}
                        {tag === "settings" ? <Settings /> : <ViewProfile />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ViewProfile() {

    const { data, refetch } = useQuery({
        queryKey: ['loginUser'],
        queryFn: () => getUserProfile(),
        staleTime: 5000,
    })
    console.log(data);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">View Profile</h1>
            <div>
                <Input name="name" disabled type="text" placeholder="Full Name">Full Name</Input>
                <Input name="newEmail" disabled type="email" placeholder="test@gmail.com">Email Address</Input>
                <Input name="phoneNumber" disabled type="text" placeholder="+1234567890">Phone Number</Input>
                <Input name="dateOfBirth" disabled type="date" placeholder="Date of Birth">Date of Birth</Input>
                <Input name="newpassword" disabled type="password" placeholder="Current Password">Current Password</Input>
            </div>
        </div>
    )
}

function Settings() {
    return (
        <div>
            <h1>Settings</h1>
        </div>
    )
}

function NavMenu() {

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