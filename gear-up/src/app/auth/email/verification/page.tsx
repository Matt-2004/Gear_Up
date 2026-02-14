import { Metadata } from "next"
import EmailSend from "../EmailSend"

export const metadata: Metadata = {
	title: "Email Verification - Gear Up",
	description: "Verify your email address to complete your registration.",
}

const Page = () => {
	return <EmailSend variant="verification" />
}

export default Page
