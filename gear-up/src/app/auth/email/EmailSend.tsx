"use client"

import { useToast } from "@/app/hooks/useToast"
import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import {
	AuthPageCaption,
	AuthPageContainer,
	AuthPageContent,
	FormContainer,
} from "@/components/Navbar/common"
import Link from "next/link"
import { Submit } from "./verification/action"

const EmailSend = ({ onSubmit }: { onSubmit: Submit }) => {
	const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
		toastType: "success",
		message: null,
	})

	return (
		<AuthPageContainer>
			{/* <AnimatePresence>
								{mutation.isSuccess && <ToastComponent />}
							</AnimatePresence> */}
			<FormContainer>
				<AuthPageCaption>Email Verficiation</AuthPageCaption>
				<AuthPageContent>
					Enter the email address associated with your account and we’ll send an
					email with instructions to reset password
				</AuthPageContent>
				<form
					action={onSubmit}
					className="flex w-full flex-col items-center justify-center gap-4"
				>
					<Input
						name="email"
						type="email"
						placeholder="Enter your email address"
					>
						Email
					</Input>
					<Button provider="manual">Send Reset Link</Button>
					<h1>
						Remember your password?{" "}
						<Link
							href={"/auth/login"}
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
