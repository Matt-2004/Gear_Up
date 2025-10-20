"use client"

import { INewPassword, useFormData } from "@/app/hooks/useFormData";
import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Button";
import Input from "@/components/Input"
import { API_URL } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import Image from "next/image"
import { FormEvent } from "react";
import { getClientCookies } from "@/utils/getClientCookie";
import { updateNewPassword } from "@/utils/FetchAPI";

const Page = () => {
    const token = getClientCookies() as { access_token?: string, reset_token?: string } | void;

    const { formData, handleChange } = useFormData("newPassword");

    // updateNewPassword(formdata, access_token, reset_token)
    const { refetch } = useQuery({
        queryKey: ['newPassoword'],
        queryFn: () => updateNewPassword({
            newPassword: formData.newPassword,
            confirmedPassword: formData.confirmedPassword
        }, token?.access_token as string, token?.reset_token as string),
        staleTime: 5000,
        enabled: false
    })

    const { ToastUI, loading, show, handleToastContext } = useToast(refetch, "emailVerify");


    const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleToastContext();

    }

    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <AnimatePresence>
                {show && <ToastUI />}
            </AnimatePresence>
            <form onSubmit={onsubmit} className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
                    {/* Logo */}
                    <h1>Create New Password</h1>
                </div>

                <p className="w-2/4 mb-4 -ml-4">Your new password must be different from previous and password.</p>
                <div className="flex flex-col gap-4 mb-4">

                    <Input name="newPassword" onChange={handleChange} required minLength={8} autoComplete="new-password" type="password" placeholder="Enter your new password">New Password</Input>
                    <Input name="confirmedPassword" onChange={handleChange} required minLength={8} type="password" placeholder="Re-enter your new password">Confirm Password</Input>
                </div>
                <Button loading={loading}>Change Password</Button>
            </form>
        </div>
    )
}

export default Page