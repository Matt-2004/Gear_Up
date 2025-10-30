"use client";

import clsx from "clsx";
import { InputHTMLAttributes, Ref, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "./SVGs";
import { ChildProcess } from "child_process";


interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    type: "email" | "password" | "text" | "checkbox" | "date";
    ref?: Ref<HTMLInputElement>;
    children: React.ReactNode;
    inputSize?: "half" | "full";
}

export default function Input({
    inputSize = "full",
    type = "email",
    ref,
    children,
    ...props
}: InputProps) {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <div className=" flex flex-col gap-1">
            <label htmlFor={type} className="text-[14px]">{children}</label>
            <div className="relative w-full">
                <input
                    id={type}
                    type={isPasswordVisible ? "text" : type}
                    ref={ref}
                    {...props}
                    className={clsx(inputSize == "half" ? "md:w-[14.5rem]" : "md:w-[30rem]", "w-full placeholder:text-[14px] outline-none text-[16px]  py-3 px-4  rounded-md focus:border-primary border border-gray-200  bg-white text-gray-800 ")}
                />

                {type == "password" &&
                    <div onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0  right-3 flex items-center  cursor-pointer">
                        {isPasswordVisible ? <EyeIcon /> : <EyeSlashIcon />}
                    </div>}

            </div>


        </div>
    );
}