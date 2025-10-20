"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useFormData } from "@/app/hooks/useFormData";
import { useToast } from "@/app/hooks/useToast";
import { AnimatePresence } from "framer-motion";
import { login } from "@/utils/FetchAPI";

const Page = () => {
    const { formData, handleChange } = useFormData("login");

    const { refetch } = useQuery({
        queryKey: ['loginUser'],
        queryFn: () => login({
            usernameOrEmail: formData.usernameOrEmail,
            password: formData.password,
        }),
        staleTime: 5000,
        enabled: false, // Disable automatic query on mount
    })

    const { ToastUI, loading, show, handleToastContext } = useToast(refetch, "login");

    const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleToastContext();
    }

    return (
        <div className="relative h-screen w-screen flex justify-center items-center flex-col">
            <AnimatePresence>
                {show && <ToastUI />}
            </AnimatePresence>
            <form onSubmit={onsubmit} className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <Title name="Login to your account" />
                <div id="body" className="flex flex-col justify-center items-center gap-4 mb-4">

                    <Input name="usernameOrEmail" required autoComplete="email" onChange={handleChange} type="email" placeholder="example@gmail.com or matthew">Email or User Name</Input>

                    <Input name="password" required minLength={8} autoComplete="current-password" onChange={handleChange} type="password" placeholder="Password (mininum at least 8 characters)">Password</Input>

                </div>
                <div className="w-[30rem] flex justify-between items-center mb-4">
                    <div className="flex h-full gap-2 items-center">
                        <input onChange={handleChange} id="rememberMe" type="checkbox" />
                        <label htmlFor="rememberMe" className="">Remember me</label>
                    </div>
                    <Link href="/auth/forgotpassword/" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
                </div>
                <Button loading={loading}>Login</Button>

                <h1>Don't have an account? <Link href={"/auth/register"} className="text-blue-600 font-medium hover:underline hover:underline-offset-4">Register Now</Link></h1>
            </form>
        </div>
    );
};

export const Title = ({ name }: { name: string }) => {
    return (
        <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
            {/* Logo */}
            <h1>{name}</h1>
        </div>
    )
}

export default Page;