"use client"

import { useRouter } from "next/navigation"
import Button from "@/components/Common/Button"
import Input from "@/components/Common/Input"
import { AuthPageCaption, AuthPageContainer, FormContainer } from "../component"
import { authAPI } from "@/utils/Auth/authAPI"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LoginSchema } from "../typeSchema"
import { useAuthForm } from "../useAuthForm"
import { useAuthToast } from "../hooks/useAuthToast"

const Login = () => {
	const router = useRouter()

	const { ToastComponent, showSuccessToast, showErrorToast, hideToast } =
		useAuthToast({
			onSuccess: { message: "Login successful! Redirecting to dashboard..." },
			onError: { message: "Invalid credentials. Please try again." },
		})

	// authAPI --> return data || error
	// submit --> get data and catch error
	// handleSubmit --> get data and catch error

	// authAPI --> return data || error
	// submit --> get data and rethrow error
	// handleSubmit --> catch error and show relevant toast
	async function action(formData: FormData) {
		const usernameOrEmail = formData.get("usernameOrEmail") as string
		const password = formData.get("password") as string

		await authAPI(`/api/auth/login`, {
			usernameOrEmail,
			password,
		})
	}

	const {
		formData,
		setFormData,
		errors,
		handleSubmit: handleFormSubmit,
		isButtonActive,
		isPending,
	} = useAuthForm(
		{
			usernameOrEmail: "",
			password: "",
			rememberMe: false,
		},
		LoginSchema,
		action,
	)

	const handleSubmit = async (formData: FormData) => {
		try {
			await handleFormSubmit(formData)
			showSuccessToast()
			setTimeout(() => {
				router.push("/")
			}, 2000)
		} catch (error) {
			showErrorToast()

			hideToast()
			setFormData({
				usernameOrEmail: "",
				password: "",
				rememberMe: false,
			})
		}
	}

	return (
		<AuthPageContainer>
			<AnimatePresence>
				<ToastComponent />
			</AnimatePresence>

			<FormContainer>
				<AuthPageCaption>Login to your account</AuthPageCaption>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSubmit(new FormData(e.currentTarget))
					}}
					id="body"
					className="mb-4 flex flex-col items-center justify-center gap-4"
				>
					<div className="flex w-full max-w-100 gap-2">
						<div className="flex-1">
							<Input
								name="usernameOrEmail"
								autoComplete="email"
								type="text"
								placeholder="example@gmail.com or matthew"
								value={formData.usernameOrEmail}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										usernameOrEmail: e.target.value,
									}))
								}
							>
								Email or User Name
							</Input>
							{errors.usernameOrEmail && (
								<p className="mt-1 text-sm text-red-600">
									{errors.usernameOrEmail}
								</p>
							)}
						</div>
					</div>

					<div className="w-full max-w-100">
						<Input
							name="password"
							minLength={8}
							autoComplete="current-password"
							type="password"
							placeholder="Password (mininum at least 8 characters)"
							value={formData.password}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, password: e.target.value }))
							}
						>
							Password
						</Input>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">{errors.password}</p>
						)}
					</div>
					<div className="mb-4 flex w-full max-w-100 items-center justify-between">
						<div className="flex h-full items-center gap-2">
							<input
								required
								id="rememberMe"
								type="checkbox"
								checked={formData.rememberMe}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										rememberMe: e.target.checked,
									}))
								}
							/>
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
					<Button width="full" disabled={!isButtonActive} loading={isPending}>
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
			</FormContainer>
		</AuthPageContainer>
	)
}

export default Login
