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
import { Submit } from "./action"

const ResetPassword = ({ onSubmit }: { onSubmit: Submit }) => {
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
				<AuthPageCaption>Create new password</AuthPageCaption>
				<AuthPageContent>
					Your new password must be different from previous and password.
				</AuthPageContent>
				<form
					action={onSubmit}
					className="flex w-full flex-col items-center justify-center gap-4"
				>
					<Input
						name="newPassword"
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
						required
						minLength={8}
						type="password"
						placeholder="Re-enter your new password"
					>
						Confirm Password
					</Input>
					<Button>Change Password</Button>
				</form>
			</FormContainer>
		</AuthPageContainer>
	)
}

export default ResetPassword
