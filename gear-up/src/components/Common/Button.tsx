"use client"

import { ButtonHTMLAttributes, memo } from "react"
import Spinner from "./Spinner"
import { signIn } from "next-auth/react"
import clsx from "clsx"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	loading: boolean
	provider: "google" | "facebook" | "manual"
	disabled: boolean
	size: "half" | "full"
}

// Button usage
// -> Auth
// -> Profile

// function
// -> Should have "Loading" when click...
//

function Button({
	children,
	loading,
	provider,
	disabled,
	size = "full",
}: Partial<ButtonProps>) {
	function handleProviderLogin() {
		if (provider === "google") {
			// Handle Google login
			return signIn("google", { callbackUrl: "/" })
		}
		if (provider === "facebook") {
			// Handle Facebook login
			return signIn("facebook", { callbackUrl: "/" })
		}
	}

	return (
		<button
			onClick={handleProviderLogin}
			disabled={disabled}
			type="submit"
			className={clsx(
				size === "half" ? "w-[14.5rem]" : "w-[30rem]",
				"bg-primary flex items-center justify-center gap-6 rounded-md py-3 text-xl font-medium text-white transition-all disabled:bg-gray-400",
			)}
		>
			{loading && <Spinner />}
			{children}
		</button>
	)
}

export default memo(Button)
