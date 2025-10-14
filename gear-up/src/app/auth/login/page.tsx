"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { FormEvent } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface ILoginFormData {
    identifier: string;
    password: string;
}

const Page = () => {
    const registerUser = async (formData: ILoginFormData) => {
        const { data } = await axios.post("https://localhost:7083/api/av1/auth/register", formData);
        return data;
    }

    const onsubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const { data } = useQuery({
        //     queryKey: ['registerUser'],
        //     queryFn: () => registerUser({
        //         identifier: "test@gmail.com",
        //         password: "test@1234"
        //     })
        // })
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <form onSubmit={onsubmit} className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <Title name="Login to your account" />
                <div id="body" className="flex flex-col justify-center items-center gap-4 mb-4">

                    <Input type="email" placeholder="example@gmail.com or matthew">Email or User Name</Input>

                    <Input type="password" placeholder="Password (mininum at least 8 characters)">Password</Input>

                </div>
                <div className="w-[30rem] flex justify-between items-center mb-4">
                    <div className="flex h-full gap-2 items-center">
                        <input id="rememberMe" type="checkbox" />
                        <label htmlFor="rememberMe" className="">Remember me</label>
                    </div>
                    <Link href="/auth/forgotpassword/" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
                </div>
                <Button>Login</Button>
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