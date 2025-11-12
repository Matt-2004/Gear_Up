"use client";

import { ButtonHTMLAttributes, memo, useState } from "react"
import Spinner from "./Spinner";
import { signIn } from "next-auth/react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading: boolean;
    provider: "google" | "facebook" | "manual";
    disabled: boolean;
    size: "half" | "full"
}

// Button usage 
// -> Auth
// -> Profile

// function
// -> Should have "Loading" when click...
// 

function Button({ children, loading, provider, disabled, size = "full" }: Partial<ButtonProps>) {
    function handleProviderLogin() {
        if (provider === "google") {
            // Handle Google login
            return signIn("google", { callbackUrl: "/" });
        }
        if (provider === "facebook") {
            // Handle Facebook login
            return signIn("facebook", { callbackUrl: "/" });
        }

    }

    return (
        <button onClick={handleProviderLogin} disabled={disabled} type="submit" className={clsx(size === "half" ? "w-[14.5rem]" : "w-[30rem]", "transition-all  disabled:bg-gray-400 bg-primary py-3 rounded-md font-medium text-xl text-white flex justify-center items-center gap-6")}>{loading && <Spinner />}{children}</button>
    )
}

export default memo(Button);