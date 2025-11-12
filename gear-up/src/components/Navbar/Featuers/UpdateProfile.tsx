"use client"

import Button from "../../Button";
import { AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useProfile } from "../useProfile";
import { useToast } from "@/app/hooks/useToast";
import { IProfileFormData, useJSON } from "@/app/hooks/useJSON";
import { updateUserProfile } from "@/utils/FetchAPI";
import Input from "../../Input";

export default function UpdateProfile() {

    const queryClient = useQueryClient();
    // Get the data
    // Only response name, avatarURL, email when getting user profile
    const { data, refetch, isLoading } = useProfile();
    const { ToastUI, loading, show, handleToastContext } = useToast(refetch, "updateProfile");
    const [getChangedData, setGetChangedData] = useState<Partial<IProfileFormData> | undefined>(undefined);

    function changedData(e: React.ChangeEvent) {
        const { name, value } = e.target as HTMLInputElement;
        setGetChangedData((prev) => {
            const updated = { ...prev, [name]: value };

            // Remove empty, null, or undefined fields
            Object.keys(updated).forEach((k) => {
                const val = updated[k as keyof IProfileFormData];
                if (val === "" || val == null) {
                    delete updated[k as keyof IProfileFormData];
                }
            });

            return Object.keys(updated).length > 0 ? updated : undefined;
        })

    }

    function onChangeFuc(e: React.ChangeEvent) {
        handleChange(e);
        changedData(e);
    }

    console.log("Changed Data:: ", getChangedData);
    // But the updating data is different
    const { JSONData, handleChange } = useJSON("profile", {
        NewEmail: data?.data.email || "",
        Name: data?.data.name || "",
        AvatarImage: data?.data.avatarUrl || "",
        DateOfBirth: "",
        PhoneNumber: "",
        CurrentPassword: "",
        NewPassword: "",
        ConfirmedNewPassword: "",
    })



    type InputType = "email" | "password" | "text" | "checkbox" | "date" | "tel";
    type FormField = { title: string, name: string; value: string; type: InputType; placeholder: string; };

    const FORM_FIELD: FormField[] = [
        { title: "Email", name: "NewEmail", value: JSONData.NewEmail, type: "email", placeholder: "name@example.com" },
        { title: "Name", name: "Name", value: JSONData.Name, type: "text", placeholder: "John Doe" },
        { title: "Date of Birth", name: "DateOfBirth", value: JSONData.DateOfBirth, type: "date", placeholder: "01/01/2000" },
        { title: "Phone No.", name: "PhoneNumber", value: JSONData.PhoneNumber, type: "tel", placeholder: "+66 89 123 4567" },
        { title: "Current Password", name: "CurrentPassword", value: JSONData.CurrentPassword, type: "password", placeholder: "••••••••" },
        { title: "New Password", name: "NewPassword", value: JSONData.NewPassword, type: "password", placeholder: "••••••••" },
        { title: "Re-type your Password", name: "ConfirmedNewPassword", value: JSONData.ConfirmedNewPassword, type: "password", placeholder: "••••••••" },
    ]
    // -> Display the data, set the state with onChange

    const mutation = useMutation({
        // api input is FormData
        mutationFn: (data: Partial<IProfileFormData>) => updateUserProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            handleToastContext();
        },
        onError: (error) => {
            console.error(error)
        }
    })
    // -> Call the api function with the lastest data

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!getChangedData) {
            // nothing changed, don't call the mutation
            return;
        }
        mutation.mutate(getChangedData);
        setGetChangedData(undefined)
    }

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    console.log("data:: ", getChangedData === undefined ? false : true, getChangedData)
    return (

        <div className="w-full">
            <AnimatePresence>
                {show && <ToastUI />}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="flex flex-col mx-auto justify-center items-start w-[65%] p-4 ">
                <h1 className="text-2xl font-semibold pb-4">
                    Personal Information
                </h1>
                <div className="space-y-5">
                    {FORM_FIELD.map((field) => (
                        <>
                            {field.name === "CurrentPassword" &&
                                <h1 className="text-2xl font-semibold pt-10 ">
                                    Change Password
                                </h1>}
                            <Input placeholder={field.placeholder} horizontal={true} key={field.name} type={field.type} name={field.name} value={field.value} onChange={onChangeFuc}>
                                {field.title}
                            </Input>
                        </>

                    ))}
                </div>
                <div className="mt-10" />
                <div className="self-end">

                    <Button size="half" disabled={getChangedData ? false : true} loading={loading}>Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
