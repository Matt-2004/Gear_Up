"use client"

import clsx from "clsx"
import { InputHTMLAttributes, Ref, useState } from "react"
import { EyeIcon, EyeSlashIcon } from "./SVGs"

interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	type: "email" | "password" | "text" | "checkbox" | "date" | "tel"
	ref: Ref<HTMLInputElement>
	children: React.ReactNode
	size: "half" | "full"
	horizontal: boolean
}

export default function Input({
	size = "full",
	type = "email",
	horizontal = false,
	ref,
	children,
	...props
}: Partial<InputProps>) {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

	return (
		<div
			className={clsx(
				"flex",
				horizontal === true
					? "items-center justify-between gap-10"
					: "flex-col",
			)}
		>
			<label htmlFor={type} className="text-sm text-gray-300">
				{children}
			</label>
			<div className="relative w-full md:w-[30rem]">
				<input
					id={type}
					type={isPasswordVisible ? "text" : type}
					ref={ref}
					{...props}
					className={clsx(
						size == "half" ? "md:w-[14.5rem]" : "md:w-[30rem]",
						"w-full rounded-md border border-[#3B4252] bg-gray-100 px-4 py-2 text-black outline-none focus:ring-1 disabled:bg-[#2A2E3D] disabled:text-white",
					)}
				/>

				{type == "password" && (
					<div
						onClick={() => setIsPasswordVisible(!isPasswordVisible)}
						className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
					>
						{isPasswordVisible ? <EyeIcon /> : <EyeSlashIcon />}
					</div>
				)}
			</div>
		</div>
	)
}
