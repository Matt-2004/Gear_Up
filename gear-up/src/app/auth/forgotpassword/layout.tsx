import { Metadata } from "next"

export default function ForgotPasswordLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div>{children}</div>
}

export const metadata: Metadata = {
	title: "Forgot Password - Gear Up",
	description:
		"Reset your Gear Up account password to regain access and stay connected.",
}
