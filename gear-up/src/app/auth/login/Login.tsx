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
import { submit, type LoginActionState } from "./action"


const initialState: LoginActionState = {
	ok: false,
	toastType: "info",
	message: null,
	redirectTo: null,
}

const Login = () => {
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
				<AuthPageCaption>Login to your account</AuthPageCaption>
				<form
					action={formAction}
					id="body"
					className="mb-4 flex w-full flex-col items-center justify-center gap-4"
				>
					<Input
						name="usernameOrEmail"
						required
						autoComplete="email"
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
						type="password"
						placeholder="Password (mininum at least 8 characters)"
					>
						Password
					</Input>
					<div className="mb-4 flex w-full max-w-100 items-center justify-between">
						<div className="flex h-full items-center gap-2">
							<input id="rememberMe" type="checkbox" />
							<label htmlFor="rememberMe" className="">
								Remember me
							</label>
						</div>
						<Link
							href="/auth/email/reset-password"
							className="text-sm text-blue-600 hover:underline"
						>
							Forgot Password?
						</Link>
					</div>
					<Button provider={"manual"} loading={pending} disabled={pending}>
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
			</FormContainer>
		</AuthPageContainer>
	)
}

export default Login
