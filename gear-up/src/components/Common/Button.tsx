"use client"

import clsx from "clsx"
import { signIn } from "next-auth/react"
import { ButtonHTMLAttributes, memo } from "react"
import Spinner from "./Spinner"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	loading: boolean
	provider: "google" | "facebook" | "manual"
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
	...props
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
			// onClick={handleProviderLogin}
			type="submit"
			className={clsx(
				"bg-primary active:bg-primary-active flex w-full max-w-[25rem] items-center justify-center gap-6 rounded-md py-2 text-lg font-medium text-white transition-shadow hover:cursor-pointer hover:shadow-lg disabled:bg-gray-400",
			)}
			{...props}
		>
			{loading && <Spinner />}
			{children}
		</button>
	)
}

export default memo(Button)
