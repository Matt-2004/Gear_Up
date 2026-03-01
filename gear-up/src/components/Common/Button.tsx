"use client"

import clsx from "clsx"
import { signIn } from "next-auth/react"
import { ButtonHTMLAttributes, memo } from "react"
import Spinner from "./Spinner"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	loading: boolean
	provider: "google" | "facebook" | "manual"
	width: "full" | "half"
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
	width = "full",
	...props
}: Partial<ButtonProps>) {
	

	return (
		<button
			// onClick={handleProviderLogin}
			type="submit"
			className={clsx(
				width === "full" ? "max-w-100" : "max-w-60",
				"bg-primary-500 font-semibold active:bg-primary-600 flex w-full min-w-40 items-center justify-center gap-6 rounded-md py-2 text-lg text-white transition-shadow hover:cursor-pointer hover:shadow-sm shadow-primary-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none disabled:hover:bg-gray-400",
			)}
			{...props}
		>
			{loading && <Spinner />}
			{children}
		</button>
	)
}

export default memo(Button)
