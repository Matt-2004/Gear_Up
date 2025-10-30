"use client";

import { ButtonHTMLAttributes, memo, useState } from "react"
import { extend } from "zod/v4-mini"
import Spinner from "./Spinner";
import { signIn } from "next-auth/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading?: boolean;
    provider: "google" | "facebook" | "manual";
}

function Button({ children, loading, provider }: ButtonProps) {
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
    console.log(provider + " login clicked");

    return (
        <button onClick={handleProviderLogin} type={provider == "manual" ? "submit" : "button"} className="w-[30rem] main-color-gradient py-3 rounded-md font-medium text-xl text-white mb-4 flex justify-center items-center gap-6">{loading && <Spinner />}{children}</button>
    )
}

export default memo(Button);