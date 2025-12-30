import { authCookieIntegration } from "@/lib/authCookieIntegration"
import { revalidatePath } from "next/cache"
import { redirect, RedirectType } from "next/navigation"

export async function submit(formData: FormData) {
	"use server"
	const username = formData.get("username") as string
	const email = formData.get("email") as string
	const firstName = formData.get("firstName") as string
	const lastName = formData.get("lastName") as string
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	const res = await authCookieIntegration(`/api/auth/register`, {
		username,
		email,
		firstName,
		lastName,
		password,
		confirmPassword,
	})

	revalidatePath("/")

	// redirect if successful
	if (res.isSuccess) {
		redirect("/", RedirectType.push)
	}
}

export type Submit = typeof submit
