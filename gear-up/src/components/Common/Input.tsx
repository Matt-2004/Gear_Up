import { InputHTMLAttributes, ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	type: "email" | "password" | "text" | "checkbox" | "date" | "tel"
	children: ReactNode
}

export default function Input({
	type = "email",
	children,
	...props
}: Partial<InputProps>) {
	return (
		<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
			<label className="text-sm font-semibold text-gray-500">{children}</label>
			<input
				{...props}
				type={type}
				className="focus:ring-primary rounded-lg border border-gray-200 px-4 py-1.5 text-black placeholder:text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none"
			/>
		</div>
	)
}
