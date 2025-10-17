import { ButtonHTMLAttributes, useState } from "react"
import { extend } from "zod/v4-mini"
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading?: boolean;
}

export default function Button({ children, loading, }: ButtonProps) {

    return (
        <button type="submit" className="w-[30rem] main-color-gradient py-3 rounded-md font-medium text-xl text-white mb-4 flex justify-center items-center gap-6">{loading && <Spinner />}{children}</button>
    )
}