"use client"

import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import {
	AuthPageCaption,
	AuthPageContainer,
	AuthPageContent,
	FormContainer,
} from "../component"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { submit as submitReset } from "./reset-password/action"
import { submit as submitVerification } from "./verification/action"
import { useAuthForm } from "../useAuthForm"
import { useAuthToast } from "../hooks/useAuthToast"
import { sendEmailSchema } from "../typeSchema"

type EmailVariant = "verification" | "reset-password"

const EmailSend = ({ variant }: { variant: EmailVariant }) => {
	const router = useRouter()
	const action = variant === "verification" ? submitVerification : submitReset
	const isVerification = variant === "verification"

	const { ToastComponent, showSuccessToast, showErrorToast } = useAuthToast({
		onSuccess: {
			message: isVerification
				? "Verification email sent successfully!"
				: "Password reset link sent to your email!",
		},
		onError: {
			message: isVerification
				? "Failed to send verification email."
				: "Failed to send reset email.",
		},
	})

	const {
		handleSubmit: handleFormSubmit,
		isButtonActive,
		isPending,
	} = useAuthForm({ email: "" }, sendEmailSchema, action)

	const handleSubmit = async (formData: FormData) => {
		try {
			await handleFormSubmit(formData)
			showSuccessToast()
			setTimeout(() => {
				router.push("/auth/login")
			}, 2000)
		} catch (error) {
			showErrorToast()
		}
	}

	return (
		<AuthPageContainer>
			<AnimatePresence>
				<ToastComponent />
			</AnimatePresence>
			<FormContainer>
				<AuthPageCaption>Email Verification</AuthPageCaption>
				<AuthPageContent>
					Enter the email address associated with your account and we&apos;ll
					send an email with instructions to reset password
				</AuthPageContent>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSubmit(new FormData(e.currentTarget))
					}}
					className="flex w-full flex-col items-center justify-center gap-4"
				>
					<Input
						name="email"
						type="email"
						placeholder="Enter your email address"
					>
						Email
					</Input>
					<Button loading={isPending} disabled={!isButtonActive}>
						Send Reset Link
					</Button>
					<h1>
						Remember your password?{" "}
						<Link
							href="/auth/login"
							className="font-medium text-blue-500 hover:underline hover:underline-offset-2"
						>
							Login Now
						</Link>
					</h1>
				</form>
			</FormContainer>
		</AuthPageContainer>
	)
}

export default EmailSend
