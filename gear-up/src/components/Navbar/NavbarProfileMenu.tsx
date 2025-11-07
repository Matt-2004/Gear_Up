import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { userProfile } from "./useProfile";
import { userProfileResponse } from "@/app/types/api.types";

import { clsx, XIcon, usePopup, useFormData, Input, updateUserProfile, IProfileFormData } from "./index"
import Button from "../Button";

function ProfileMenu() {

    const { closePopup, setTag, tag } = usePopup();
    const profile = userProfile();

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
                        {(tag === 'viewProfile' && profile) && <ViewProfile profile={profile} />}
                        {(tag === 'updateProfile' && profile) && <UpdateProfile profile={profile} />}
                        {tag === "settings" && <Settings />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function UpdateProfile({ profile }: { profile: userProfileResponse }) {

    const { email, name, avatarUrl } = profile.data

    const { formData, handleChange } = useFormData("profile", {
        newEmail: email,
        name: name,
        avatarUrl: avatarUrl,
        dateOfBirth: "2025-10-11",
        phoneNumber: "000-000-000",
        currentPassword: "",
        newPassword: "",
        confirmedNewPassword: ""
    });

    console.log("FormData Name:: ", formData.name)

    const itemList: {
        id: string;
        label: string;
        value: string;
        type: "text" | "email" | "password" | "date" | "checkbox";
    }[] = [
            { id: "name", label: "Full Name", value: formData.name, type: "text" },
            { id: "newEmail", label: "Email", value: formData.newEmail, type: "email" },
            { id: "phoneNumber", label: "Phone Number", value: formData.phoneNumber, type: "text" },
            { id: "dateOfBirth", label: "Date of Birth", value: formData.dateOfBirth, type: "date" },
            { id: "currentPassword", label: "Current Password", value: formData.currentPassword, type: "password" },
            { id: "newPassword", label: "New Password", value: formData.newPassword, type: "password" },
            { id: "confirmedPassword", label: "Confirm Password", value: formData.confirmedNewPassword, type: "password" },
        ];

    // useEffect(() => {
    //     setFormData(profile)
    // }, [])

    const queryClient = useQueryClient();

    // Mutation to update profile
    const updateMutation = useMutation({
        mutationFn: (profileData: IProfileFormData) => updateUserProfile(profileData),
        onSuccess: (data) => {
            // Refetch profile data after successful update
            // queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            console.log("Update profile success! Here is the data:: ", data);

        }
    });

    const handleUpdateProfile = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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




    return (
        <form onSubmit={handleUpdateProfile}>
            <div className="p-4">
                <h1 className="text-2xl font-medium">View Profile</h1>
                <div className="flex flex-col gap-4 mt-4">
                    <img src={profile.data.avatarUrl} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover" />
                    {itemList.map((data) => (
                        <Input
                            key={data.id}
                            onChange={handleChange}
                            id={data.id}
                            name={data.id}
                            type={data.type}
                            value={data.value}
                        >
                            {data.label}
                        </Input>
                    ))}
                </div>
            </div>
            <button
                type="submit"
                className="mt-4 main-color-gradient text-white font-medium px-4 py-2 rounded-md cursor-pointer"
            >
                Save Changed
            </button>



        </form>

    )


}


function ViewProfile({ profile }: { profile: userProfileResponse }) {

    const userData = Object.entries(profile.data);

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-medium">View Profile</h1>
                <div className="flex flex-col gap-4 mt-4">
                    <img src={profile.data.avatarUrl} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover" />
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

function Settings() {

    return (
        <div>
            <h1>Settings</h1>
        </div>
    )

}


export default ProfileMenu;