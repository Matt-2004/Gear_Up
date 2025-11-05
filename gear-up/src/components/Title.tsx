import Image from "next/image";
import { ChatIcon, EyeIcon, MagnifyingGlass, MenuBar, XIcon } from "./SVGs";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { TitleContentProvider, usePopup } from "@/provider/TitleContext";
import { useFormData } from "@/app/hooks/useFormData";
import Input from "./Input";
import { getUserProfile, updateUserProfile, UserProfileData } from "@/utils/FetchAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

// Navbar 
//  -> NavUtils 
//      -> Profile 
//          -> DropDownProfileMenu 
//              -> ViewProfile / UpdateProfile / Settings

function TitleContainer({ children }: { children: React.ReactNode }) {
    const { isOpen } = usePopup();
    return (
        <>
            <div className=" relative w-full  border-[#7ED957] border-b h-16 flex justify-center bg-[#142030]">
                <div className="z-20 xl:w-[75%] w-[90%] items-center flex justify-between h-16 object-fill ">
                    {children}
                </div>
            </div>
            {isOpen && <DropDownProfileMenu />}
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

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['loginUser'],
        queryFn: () => getUserProfile(),
        staleTime: 5000,
        enabled: true
    })

    return (
        <div className="lg:flex h-full items-center xl:gap-8 lg:gap-6 hidden">
            <SearchBarIcon />
            <Chat />
            {data ? <User data={data} /> : <Login />}
        </div>
    )
}

function User({ data }: { data: UserProfileData }) {
    console.log("User component is rendered");
    const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState<boolean>(false);

    return (


        <div className="flex items-center gap-4 cursor-pointer relative" onClick={() => { setIsUpdateProfileOpen(!isUpdateProfileOpen) }}>
            <Image src={data.data.avatarUrl} alt="Profile Picture" width={40} height={40} className="rounded-full" />
            <span className="text-white font-medium">{data.data.name}</span>
            {isUpdateProfileOpen && <Profile />}
        </div>

    )
}

function Profile() {
    console.log("Profile component is rendered");

    const { openPopup, setTag } = usePopup();

    // TODO: Logout function --> handle for manually and provider 

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

function DropDownProfileMenu() {
    console.log("DropDownProfileMenu component is rendered");

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
                            <li className={clsx(tag === "viewProfile" ? "text-[#7ED957]  border border-[#7ED957] bg-[#D6FFC4] " : "text-black", "hover:text-[#7ED957] hover:bg-[#D6FFC4] rounded-lg font-medium w-72 h-10 flex items-center pl-6 cursor-pointer")} onClick={() => setTag("viewProfile")}>Profile</li>
                            <li className={clsx(tag === "updateProfile" ? "text-[#7ED957]  border border-[#7ED957] bg-[#D6FFC4] " : "text-black", "hover:text-[#7ED957] hover:bg-[#D6FFC4] rounded-lg font-medium w-72 h-10 flex items-center pl-6 cursor-pointer")} onClick={() => setTag("updateProfile")}>Update Profile</li>
                            <li className={clsx(tag === "settings" ? "text-[#7ED957]  border border-[#7ED957] bg-[#D6FFC4] " : "text-black", "hover:text-[#7ED957] hover:bg-[#D6FFC4] rounded-lg font-medium w-72 h-10 flex items-center pl-6 cursor-pointer")} onClick={() => setTag("settings")}>Settings</li>
                        </ul>
                    </div>
                    <div className="w-3/4 pl-4">
                        {/* Content area */}
                        {tag === 'viewProfile' && <ViewProfile />}
                        {tag === 'updateProfile' && <UpdateProfile />}
                        {tag === "settings" && <Settings />}

                    </div>
                </div>
            </div>
        </div>
    )
}

function UpdateProfile() {

    console.log("UpdateProfile component is rendered");
    // Get the data to pre-fill the form
    // Allow user to update the data

    const { data, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        staleTime: 5000,
        enabled: true
    });

    console.log("Profile data for update:", data);

    const { formData, handleChange } = useFormData("profile");
    const [isWantUpdate, setIsWantUpdate] = useState<boolean>(false);
    const queryClient = useQueryClient();

    // Mutation to update profile
    const updateMutation = useMutation({
        mutationFn: (profileData: any) => updateUserProfile(profileData),
        onSuccess: () => {
            // Refetch profile data after successful update
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            setIsWantUpdate(false);
        }
    });

    const handleUpdateProfile = () => {
        updateMutation.mutate({
            avatarUrl: formData.avatarUrl,
            name: formData.name,
            newEmail: formData.newEmail,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmedNewPassword: formData.confirmedNewPassword,
        });
    };

    if (data) {

        return (
            <>
                <div className="p-4">
                    <h1 className="text-2xl font-medium">View Profile</h1>
                    <div className="flex flex-col gap-4 mt-4">
                        <img src={data.data.avatarUrl} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover" />
                        <Input onChange={handleChange} id="name" name="name" type="text" value={data.data.username}>Full Name</Input>
                        <Input onChange={handleChange} id="email" name="newEmail" type="email" value={data.data.email}>Email Address</Input>
                        <Input onChange={handleChange} id="ph-no" name="phoneNumber" type="text" value="+1234567890">Phone Number</Input>
                        <Input onChange={handleChange} id="birthday" name="dateOfBirth" type="date" >Date of Birth</Input>
                        <Input onChange={handleChange} id="password" name="newPassword" type="text" value="********">Current Password</Input>
                    </div>
                </div>
                <input
                    type="button"
                    value={isWantUpdate ? "Save Changes" : "Update Profile"}
                    onClick={handleUpdateProfile}
                    className="mt-4 main-color-gradient text-white font-medium px-4 py-2 rounded-md cursor-pointer"
                />
                {isWantUpdate && (
                    <input
                        type="button"
                        value="Cancel"
                        onClick={() => setIsWantUpdate(false)}
                        className="mt-4 ml-2 bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-md cursor-pointer"
                    />
                )}
            </>

        )

    } if (isLoading) {
        return <div>Loading...</div>;
    }
}

function ViewProfile() {

    console.log("ViewProfile component is rendered");

    // Query to get user profile
    const { data, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        staleTime: 5000,
        enabled: true
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (data) {

        // 
        const userData = Object.entries(data.data);

        return (
            <>
                <div className="p-4">
                    <h1 className="text-2xl font-medium">View Profile</h1>
                    <div className="flex flex-col gap-4 mt-4">
                        <img src={data.data.avatarUrl} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover" />
                        <Link href={"/profile/dealer/register"}>
                            <button className=" text-primary font-medium px-4 py-2 rounded-md cursor-pointer">
                                Become our partner
                            </button>
                        </Link>
                        {userData.map(([key, value]) => (
                            key !== "id" && key !== "role" && key !== "avatarUrl" && key !== "provider" &&
                            <Input key={key} id={key} disabled={true} name={key} type="text" value={String(value)}>{key.charAt(0).toUpperCase() + key.slice(1)}</Input>
                        ))}
                    </div>
                </div>

            </>
        );
    }
}

function Settings() {
    console.log("Settings component is rendered");
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
            <Link href="/auth/login"><button className="font-semibold">Login</button></Link>
        </div>
    )
}