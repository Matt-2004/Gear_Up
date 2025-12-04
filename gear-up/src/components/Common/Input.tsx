"use client";

import clsx from "clsx";
import { InputHTMLAttributes, Ref, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "./SVGs";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    type: "email" | "password" | "text" | "checkbox" | "date" | "tel";
    ref: Ref<HTMLInputElement>;
    children: React.ReactNode;
    size: "half" | "full";
    horizontal: boolean;
}

export default function Input({
    size = "full",
    type = "email",
    horizontal = false,
    ref,
    children,
    ...props
}: Partial<InputProps>) {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <div className={clsx("flex", horizontal === true ? "items-center justify-between gap-10" : "flex-col")}>
            <label htmlFor={type} className=" text-gray-300 font-medium ">{children}</label>
            <div className="relative md:w-[30rem] w-full ">
                <input
                    id={type}
                    type={isPasswordVisible ? "text" : type}
                    ref={ref}
                    {...props}
                    className={clsx(size == "half" ? "md:w-[14.5rem]" : "md:w-[30rem]", "w-full outline-none   py-2 px-4  rounded-md focus:border-primary border border-[#3B4252] bg-gray-100 text-black  disabled:bg-[#2A2E3D] disabled:text-white ")}
                />

                {type == "password" &&
                    <div onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0  right-3 flex items-center  cursor-pointer">
                        {isPasswordVisible ? <EyeIcon /> : <EyeSlashIcon />}
                    </div>}

            </div>


        </div>
    );
}