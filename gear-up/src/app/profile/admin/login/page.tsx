import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import {
	AuthPageCaption,
	AuthPageContainer,
	FormContainer,
} from "@/components/Navbar/common"
import { authCookieIntegration } from "@/lib/authCookieIntegration"

import { redirect, RedirectType } from "next/navigation"

const Page = () => {
	const onSubmit = async (formdata: FormData) => {
		"use server"
		const email = formdata.get("email") as string
		const password = formdata.get("password") as string

		const res = await authCookieIntegration("/api/auth/admin/login", {
			email,
			password,
		})

		if (res) {
			redirect("/profile/admin?tab=dashboard", RedirectType.replace)
		}
	}

	return (
		<AuthPageContainer>
			{/* <AnimatePresence>
						{mutation.isSuccess && <ToastComponent />}
					</AnimatePresence> */}
			<FormContainer>
				<AuthPageCaption>Admin Login</AuthPageCaption>
				<form
					action={onSubmit}
					id="body"
					className="mb-4 flex w-full flex-col items-center justify-center gap-8"
				>
					<div className="flex w-full flex-col items-center justify-center gap-4">
						<Input
							name="email"
							required
							autoComplete="email"
							type="email"
							placeholder="example@gmail.com"
						>
							Email
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
					</div>

					<Button provider={"manual"}>Login</Button>
				</form>
			</FormContainer>
		</AuthPageContainer>
	)
}

export default Page
