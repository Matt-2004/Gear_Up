"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent } from "react";



const Page = () => {



    // API call to login user with cookies
    const resentEmail = async ({ email }: { email: string }) => {
        const { data } = await axios.post(`https://e61882394d53.ngrok-free.app/api/v1/auth/resent?email=${email}`);
        return data;
    }

    const { data, error, refetch } = useQuery({
        queryKey: ['loginUser'],
        queryFn: () => resentEmail({
            email: "wai450013956@gmail.com"
        })
    })

    console.log("Login data:", data);
    console.log("Error data:", error);

    const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("clicking.. ")

        await refetch();

    }



    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <form onSubmit={onsubmit} className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
                    {/* Logo */}
                    <h1>Reset Password</h1>
                </div>

                <p className="w-2/4 mb-4 -ml-4">Enter the email address associated with your account and we’ll send an email with instructions to reset password</p>
                <div className="mb-4">

                    <Input type="email" placeholder="Enter your email address">Email</Input>
                </div>
                <Button>Send Reset Link</Button>
                <h1>Remember your password? <Link href={"/auth/login"} className="font-medium text-blue-500 hover:underline hover:underline-offset-2">Login Now</Link></h1>
            </form>
        </div>
    )
}

export default Page;