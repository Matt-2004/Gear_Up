// app/actions/auth.ts
import { authCookieIntegration } from "@/lib/authCookieIntegration"
import { revalidatePath } from "next/cache"

import { redirect, RedirectType } from "next/navigation"

export async function submit(formData: FormData) {
	"use server"
	const usernameOrEmail = formData.get("usernameOrEmail") as string
	const password = formData.get("password") as string

	const res = await authCookieIntegration(`/api/auth/login`, {
		usernameOrEmail,
		password,
	})

	revalidatePath("/")

	// redirect if successful
	if (res.isSuccess) {
		redirect("/", RedirectType.push)
	}
}

export type Submit = typeof submit
