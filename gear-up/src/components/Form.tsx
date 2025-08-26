"use client";

import Link from "next/link";
import Button from "./Button";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface FormProps {
    type: 'register' | 'login';
    instruction: string;
}

interface Inputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export default function Form({ type, instruction }: FormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [loading, setLoading] = useState(false);


    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setLoading(!loading);
        setTimeout(() => {
            // API with react query
            // While interacting with API, keep the loading state true
            // if success -> redirect to home page
            // if error -> show error message 
            setLoading(!loading);
        }, 2000)
        console.log("hello this function is working! This is data:: ", data);
    };
    return (
        <div className="lg:w-[75%] w-[90%] lg:mt-20 mt-5  mx-auto md:shadow-lg drop-shadow-2xl rounded-2xl">
            <div className="lg:flex lg:justify-between">


                <div className=" space-y-6  lg:w-[45%] lg:border-r py-16 px-6 ">

                    <h2 className="text-3xl mb-6 font-semibold flex justify-center">
                        {instruction}
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {type === 'register' && <div className="flex w-full justify-between">
                            <input {...register("firstName")} className="outline-none w-[45%] border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="text" placeholder="First Name" />
                            <input {...register("lastName")} className="outline-none w-[45%] border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="text" placeholder="Last Name" />
                        </div>}
                        <>
                            <input {...register("email")} className="outline-none w-full border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="email" placeholder="Email" required />
                            {errors.email && <p>{"Write in email format."}</p>}
                        </>
                        <input {...register("password")} className="outline-none w-full border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="password" placeholder="Password" required minLength={8} maxLength={20} autoComplete="new-password" />

                        <Checkbox type={type} />
                        {/* <Button type={type} /> */}
                        <button type="submit" onClick={() => { setLoading(true) }} disabled={loading} className="w-full cursor-pointer main-color-gradient py-3 font-medium text-lg flex justify-center gap-4">
                            {loading && <Spinner />}
                            {type.substring(0, 1).toUpperCase() + type.substring(1, type.length)}
                        </button>

                    </form>
                    <Spacer />
                    <ThirdPartyRegistration />
                    <Switcher type={type} />
                </div>
                <div className="lg:w-[50%] hidden lg:block   py-16 px-6">
                    <Image src="/Car.png" alt="Decoration" width={500} height={100} className="mt-10 mr-[-50px] mx-auto" />
                    <h2 className="text-2xl font-medium italic w-80 leading-relaxed">Every great drive begins with the first key — log in to unlock yours.</h2>
                </div>
            </div>
        </div>
    )
}

function Switcher({ type }: { type: 'register' | 'login' }) {
    return (
        <div className="flex justify-center space-x-1 text-[14px]">
            {type === 'register' && <>
                <span>Already have an account?</span>
                <Link href="/auth/login" className="text-blue-600 font-medium">Login</Link>
            </>}
            {type === 'login' && <>
                <span>Don't have an account?</span>
                <Link href="/auth/register" className="text-blue-600 font-medium">Register</Link>
            </>}
        </div>
    )
}


function ThirdPartyRegistration() {
    return (
        <div className="flex flex-col space-y-4 font-medium">
            <button className="w-full border border-black  py-2 flex items-center justify-center space-x-2">
                <img src="/Google.png" alt="Google Logo" className="w-9 h-9" />
                <span className="text-md">Google</span>
            </button>
            <button className="w-full border space-x-6  border-black py-2 flex items-center justify-center">
                <img src="/line.png" alt="Line Logo" className="w-8 h-8" />
                <span className="text-md">Line</span>
            </button>
        </div>
    )
}

function Spacer() {
    return (
        <div className="flex space-x-14">
            <div className="h-[1px] w-32 bg-black" />
            <div className="h-[1px] w-4 bg-black" />
            <div className="h-[1px] w-32 bg-black" />
        </div>
    )
}

function Checkbox(type: { type: 'register' | 'login' }) {
    return (
        <div className="flex items-center">
            {type.type === 'login' &&
                <div className="flex justify-between w-full">
                    <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 mr-2" id="remember" /><label htmlFor="remember" className="text-[12px]">Remember Me</label>
                    </div>
                    <h3 className="text-[14px] font-medi">Forget Password</h3>
                </div>}
            {type.type === 'register' && <><input type="checkbox" className="w-4 h-4 mr-2" id="terms" required /><label htmlFor="terms" className="text-[12px]">I agree to <b>The Terms of User</b></label></>}
        </div>
    )
}