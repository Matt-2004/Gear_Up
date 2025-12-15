"use client"

import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import {
	AuthPageCaption,
	AuthPageContainer,
	FormContainer,
} from "@/components/Navbar/common"
import Link from "next/link"
import { Submit } from "./action"

const Register = ({ onSubmit }: { onSubmit: Submit }) => {
	return (
		<AuthPageContainer>
			{/* <AnimatePresence>
						{mutation.isSuccess && <ToastComponent />}
					</AnimatePresence> */}
			<FormContainer>
				<AuthPageCaption>Create an account</AuthPageCaption>
				<form
					action={onSubmit}
					id="body"
					className="flex flex-col items-center justify-center gap-4"
				>
					<div className="flex w-full max-w-[25rem] gap-2">
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
					<div className="flex w-full max-w-[25rem] gap-2">
						<input id="policy" type="checkbox" className="" />
						<label htmlFor="policy" className="text-sm">
							I agree to the Terms of Service and Privacy Policy
						</label>
					</div>
					<Button provider="manual">Register</Button>
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
