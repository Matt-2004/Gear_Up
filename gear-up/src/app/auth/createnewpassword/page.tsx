"use client"

import { useToast } from "@/app/hooks/useToast"
import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import { useMutation } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"
import { FormEvent } from "react"
import { updateNewPassword } from "@/utils/FetchAPI"
import { updateAuthStatus } from "@/app/auth/helper"
import { useInputData } from "@/app/hooks/useInputData"
import { useAppDispatch } from "@/lib/hooks"
import { useRouter } from "next/navigation"

const Page = () => {
	const router = useRouter()
	const dispatch = useAppDispatch()
	const { inputData, handleInputChange } = useInputData("newPassword")
	const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
		toastType: "success",
		message: null,
	})

	const mutation = useMutation({
		mutationFn: updateNewPassword,
		onSuccess: (data: AxiosResponse) => {
			addToastMessage("success", data.data.message)
			setTimeout(() => {
				removeToastMessage("success", null)
				router.push("/")
				updateAuthStatus(dispatch)
			}, 4000)
		},
		onError: (error: AxiosResponse) => {
			addToastMessage("error", error.data.message)
			setTimeout(() => {
				removeToastMessage("error", null)
			}, 4000)
		},
	})

	const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		mutation.mutate({
			newPassword: inputData.newPassword,
			confirmedPassword: inputData.confirmedPassword,
		})
	}

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center">
			<AnimatePresence>
				{mutation.isSuccess && <ToastComponent />}
			</AnimatePresence>
			<form
				onSubmit={onsubmit}
				className="relative flex h-[70%] w-[60%] flex-col items-center justify-center gap-1 rounded-lg bg-white p-8"
			>
				<Image
					src={"/Gear.png"}
					alt="logo"
					width={180}
					height={120}
					className="absolute -top-8 left-0"
				/>
				<div
					id="header"
					className="flex h-1/4 items-center justify-center text-4xl font-bold"
				>
					{/* Logo */}
					<h1>Create New Password</h1>
				</div>

				<p className="mb-4 -ml-4 w-2/4">
					Your new password must be different from previous and password.
				</p>
				<div className="mb-4 flex flex-col gap-4">
					<Input
						name="newPassword"
						onChange={handleInputChange}
						required
						minLength={8}
						autoComplete="new-password"
						type="password"
						placeholder="Enter your new password"
					>
						New Password
					</Input>
					<Input
						name="confirmedPassword"
						onChange={handleInputChange}
						required
						minLength={8}
						type="password"
						placeholder="Re-enter your new password"
					>
						Confirm Password
					</Input>
				</div>
				<Button loading={mutation.isPending}>Change Password</Button>
			</form>
		</div>
	)
}

export default Page
