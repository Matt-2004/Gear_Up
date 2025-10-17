"use client";

import { useFormData } from "@/app/hooks/useFormData";
import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
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

    const { formData, handleChange } = useFormData("register");

    useEffect(() => {
        console.log("Form Data:", formData);
    }, [formData]);
    const registerUser = async (formData: IFormDate) => {
        // const { data } = await axios.post("https://e61882394d53.ngrok-free.app/api/v1/auth/register", formData, { withCredentials: true });

        return true;
    }

    const { refetch } = useQuery({
        queryKey: ['loginUser'],
        queryFn: () => registerUser({
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        }),
        staleTime: 5000,
        enabled: false, // Disable automatic query on mount
    })

    const { ToastUI, loading, show, handleToastContext } = useToast(refetch);

    const onsubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleToastContext();
    };

    return (
        <div className="relative h-screen w-screen flex justify-center items-center flex-col">
            <AnimatePresence>
                {show && <ToastUI />}
            </AnimatePresence>
            <form onSubmit={onsubmit} className="relative h-[80%] w-[60%]  bg-white rounded-lg flex flex-col justify-center items-center gap-4 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
                    {/* Logo */}
                    <h1>Create an account</h1>
                </div>
                <div id="body" className="flex flex-col justify-center items-center gap-4">
                    <div className="flex justify-between w-full">
                        <Input name="firstName" onChange={handleChange} inputSize="half" type="text" placeholder="John">First Name</Input>
                        <Input name="lastName" onChange={handleChange} inputSize="half" type="text" placeholder="Doe">Last Name</Input>

                    </div>
                    <Input name="username" type="text" onChange={handleChange} placeholder="John_Doe">Username</Input>
                    <Input name="email" onChange={handleChange} type="email" placeholder="example@gmail.com">Email</Input>
                    <Input name="password" onChange={handleChange} type="password" placeholder="Enter your password">Password</Input>
                    <Input name="confirmPassword" onChange={handleChange} type="password" placeholder="Re-enter your password">Confirm Password</Input>


                </div>
                <div className="w-[30rem] items-center flex gap-2">
                    <input id="policy" type="checkbox" className="" />
                    <label htmlFor="policy">I agree to the Terms of Service and Privacy Policy</label>
                </div>
                <Button loading={loading}>Register</Button>
                <h1>Already have account? <Link href={"/auth/login"} className="text-blue-600 font-medium hover:underline hover:underline-offset-4">Login Now</Link></h1>
            </form>
        </div>
    )
}


export default Page;