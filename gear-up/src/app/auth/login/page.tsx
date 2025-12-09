"use client"

import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { FormEvent } from "react"
import Input from "@/components/Common/Input"
import Button from "@/components/Common/Button"
import { useToast } from "@/app/hooks/useToast"
import { AnimatePresence } from "framer-motion"
import { login } from "@/utils/FetchAPI"
import { useInputData } from "@/app/hooks/useInputData"
import { AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { updateAuthStatus } from "@/app/auth/helper"

interface LoginResponse {
	isSuccess: boolean
	message: string
	data: {
		accessToken: string
		refreshToken: string
	}
	status: number
}

const Page = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { inputData, handleInputChange } = useInputData("login")
	const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
		toastType: "success",
		message: null,
	})

	const mutation = useMutation({
		mutationFn: login,

		onSuccess: (data: AxiosResponse<LoginResponse>) => {
			addToastMessage("success", data.data.message)
			setTimeout(() => {
				removeToastMessage("success", null)
				router.push("/")
				updateAuthStatus(dispatch)
			}, 4000)
		},
		onError: (error: AxiosResponse<LoginResponse>) => {
			addToastMessage("error", error.data.message)
			setTimeout(() => {
				removeToastMessage("error", null)
			}, 4000)
		},
	})

	const onsubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		mutation.mutate({
			usernameOrEmail: inputData.usernameOrEmail,
			password: inputData.password,
		})
	}

	return (
		<div className="relative flex h-screen w-screen flex-col items-center justify-center">
			<AnimatePresence>
				{mutation.isSuccess && <ToastComponent />}
			</AnimatePresence>
			<form
				onSubmit={onsubmit}
				className="relative flex h-[70%] w-[60%] flex-col items-center justify-center gap-1 rounded-lg bg-white p-8"
			>
				<div
					id="header"
					className="flex h-1/4 items-center justify-center text-4xl font-bold"
				>
					{/* Logo */}
					<h1>Login to your account</h1>
				</div>
				<div
					id="body"
					className="mb-4 flex flex-col items-center justify-center gap-4"
				>
					<Input
						name="usernameOrEmail"
						required
						autoComplete="email"
						onChange={handleInputChange}
						type="email"
						placeholder="example@gmail.com or matthew"
					>
						Email or User Name
					</Input>

					<Input
						name="password"
						required
						minLength={8}
						autoComplete="current-password"
						onChange={handleInputChange}
						type="password"
						placeholder="Password (mininum at least 8 characters)"
					>
						Password
					</Input>
				</div>
				<div className="mb-4 flex w-[30rem] items-center justify-between">
					<div className="flex h-full items-center gap-2">
						<input
							onChange={handleInputChange}
							id="rememberMe"
							type="checkbox"
						/>
						<label htmlFor="rememberMe" className="">
							Remember me
						</label>
					</div>
					<Link
						href="/auth/forgotpassword/"
						className="text-sm text-blue-600 hover:underline"
					>
						Forgot Password?
					</Link>
				</div>
				<Button loading={mutation.isPending} provider={"manual"}>
					Login
				</Button>

				<h1>
					Do not have an account?{" "}
					<Link
						href={"/auth/register"}
						className="font-medium text-blue-600 hover:underline hover:underline-offset-4"
					>
						Register Now
					</Link>
				</h1>
			</form>
			<Button provider="google">Login with Google</Button>
		</div>
	)
}

export default Page
