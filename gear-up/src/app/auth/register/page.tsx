"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, FormEventHandler, FormHTMLAttributes, useEffect } from "react";

interface IFormDate {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}


const Page = () => {



    const registerUser = async (formData: IFormDate) => {
        const { data } = await axios.post("https://43c8c3786b89.ngrok-free.app/api/v1/auth/register", formData);
        return data;
    }

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("Success:", data.message);
        },
        onError: (error: any) => {
            console.error("Error:", error.response?.data.message);
        },
    });



    const onsubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({
            username: "test1user",
            firstName: "Test1",
            lastName: "User1",
            email: "test1@gmail.com",
            password: "Test1@1234",
            confirmPassword: "Test1@1234",
        });
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <form onSubmit={onsubmit} className="relative h-[80%] w-[60%]  bg-white rounded-lg flex flex-col justify-center items-center gap-4 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
                    {/* Logo */}
                    <h1>Create an account</h1>
                </div>
                <div id="body" className="flex flex-col justify-center items-center gap-4">
                    <div className="flex justify-between w-full">
                        <Input inputSize="half" type="text" placeholder="John">First Name</Input>
                        <Input inputSize="half" type="text" placeholder="Doe">Last Name</Input>

                    </div>
                    <Input type="text" placeholder="John_Doe">Username</Input>
                    <Input type="email" placeholder="example@gmail.com">Email</Input>
                    <Input type="password" placeholder="Enter your password">Password</Input>
                    <Input type="password" placeholder="Re-enter your password">Confirm Password</Input>


                </div>
                <div className="w-[30rem] items-center flex gap-2">
                    <input id="policy" type="checkbox" className="" />
                    <label htmlFor="policy">I agree to the Terms of Service and Privacy Policy</label>
                </div>
                <Button>Register</Button>
                <h1>Already have account? <Link href={"/auth/login"} className="text-blue-600 font-medium hover:underline hover:underline-offset-4">Login Now</Link></h1>
            </form>
        </div>
    )
}


export default Page;