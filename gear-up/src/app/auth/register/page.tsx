"use client";

import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useMutation } from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent } from "react";
import {register} from "@/utils/FetchAPI";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { useInputData } from "@/app/hooks/useInputData";
import { updateAuthStatus } from "@/app/auth/helper";


const Page = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { inputData, handleInputChange } = useInputData("register");
    const { ToastComponent, addToastMessage, removeToastMessage } = useToast({toastType: "success", message: null});

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: (
            data: AxiosResponse
        ) => {
            addToastMessage("success", data.data.message)
            setTimeout( () => {
                removeToastMessage("success", null)
                router.push("/");
                updateAuthStatus(dispatch);
            }, 4000)
        },
        onError: (
            error: AxiosResponse
        ) => {
            addToastMessage("error", error.data.message)
            setTimeout(() => {
                removeToastMessage("error", null)
            }, 4000)
        },
    })

    const onsubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({
            username: inputData.username,
            firstName: inputData.firstName,
            lastName: inputData.lastName,
            email: inputData.email,
            password: inputData.password,
            confirmPassword: inputData.confirmPassword,
        })
    };

    return (
        <div className="relative h-screen w-screen flex justify-center items-center flex-col">
            <AnimatePresence>
                {mutation.isSuccess && <ToastComponent />}
            </AnimatePresence>
            <form onSubmit={onsubmit} className="relative h-[80%] w-[60%]  bg-white rounded-lg flex flex-col justify-center items-center gap-4 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
                    {/* Logo */}
                    <h1>Create an account</h1>
                </div>
                <div id="body" className="flex flex-col justify-center items-center gap-4">
                    <div className="flex justify-between w-full">
                        <Input name="firstName" onChange={handleInputChange} size="half" type="text" placeholder="John">First Name</Input>
                        <Input name="lastName" onChange={handleInputChange} size="half" type="text" placeholder="Doe">Last Name</Input>

                    </div>
                    <Input name="username" type="text" onChange={handleInputChange} placeholder="John_Doe">Username</Input>
                    <Input name="email" onChange={handleInputChange} type="email" placeholder="example@gmail.com">Email</Input>
                    <Input name="password" onChange={handleInputChange} type="password" placeholder="Enter your password">Password</Input>
                    <Input name="confirmPassword" onChange={handleInputChange} type="password" placeholder="Re-enter your password">Confirm Password</Input>


                </div>
                <div className="w-[30rem] items-center flex gap-2">
                    <input id="policy" type="checkbox" className="" />
                    <label htmlFor="policy">I agree to the Terms of Service and Privacy Policy</label>
                </div>
                <Button loading={mutation.isPending} provider="manual">Register</Button>
                <h1>Already have account? <Link href={"/auth/login"} className="text-blue-600 font-medium hover:underline hover:underline-offset-4">Login Now</Link></h1>
            </form>
        </div>
    )
}


export default Page;