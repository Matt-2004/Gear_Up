"use client"

import { useToast } from "@/app/hooks/useToast"
import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import {
	AuthPageCaption,
	AuthPageContainer,
	FormContainer,
} from "@/components/Navbar/common"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { submit, type RegisterActionState } from "./action"


const initialState: RegisterActionState = {
	ok: false,
	toastType: "info",
	message: null,
	redirectTo: null,
}

const Register = () => {
	const router = useRouter()
	const [state, formAction, pending] = useActionState(submit, initialState)
	const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
		toastType: "success",
		message: null,
	})

	useEffect(() => {
		if (!state?.message) return

		addToastMessage(state.toastType, state.message)
		new Promise(res => setTimeout(() => {
			removeToastMessage(state.toastType, null)
			router.push('/')
		}, 4000))

	}, [pending])

	return (
		<AuthPageContainer>
			<AnimatePresence>
				<ToastComponent />
			</AnimatePresence>

			<FormContainer>
				<AuthPageCaption>Create an account</AuthPageCaption>
				<form
					action={formAction}
					id="body"
					className="flex flex-col items-center justify-center gap-4"
				>
					<div className="flex w-full max-w-100 gap-2">
						<Input name="firstName" type="text" placeholder="John">
							First Name
						</Input>
						<Input name="lastName" type="text" placeholder="Doe">
							Last Name
						</Input>
					</div>
					<Input name="username" type="text" placeholder="John_Doe">
						Username
					</Input>
					<Input name="email" type="email" placeholder="example@gmail.com">
						Email
					</Input>
					<Input
						name="password"
						type="password"
						placeholder="Enter your password"
					>
						Password
					</Input>
					<Input
						name="confirmPassword"
						type="password"
						placeholder="Re-enter your password"
					>
						Confirm Password
					</Input>
					<div className="flex w-full max-w-100 gap-2">
						<input id="policy" type="checkbox" className="" />
						<label htmlFor="policy" className="text-sm">
							I agree to the Terms of Service and Privacy Policy
						</label>
					</div>
					<Button provider="manual" loading={pending} disabled={pending}>
						Register
					</Button>
					<h1 className="text-sm">
						Already have account?{" "}
						<Link
							href={"/auth/login"}
							className="font-medium text-blue-600 hover:underline hover:underline-offset-4"
						>
							Login Now
						</Link>
					</h1>
				</form>
			</FormContainer>
		</AuthPageContainer>
	)
}

export default Register
