import { Metadata } from "next"

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div>{children}</div>
}

export const metadata: Metadata = {
	title: "Register - Gear Up",
	description:
		"Create a Gear Up account to access exclusive features and personalized content.",
}
