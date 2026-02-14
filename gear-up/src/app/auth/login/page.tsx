import { Metadata } from "next"
import Login from "./Login"

export const metadata: Metadata = {
	title: "Login - Gear Up",
	description: "Login to your Gear Up account to access your profile and manage your vehicles.",
}

const Page = () => {
	// Submit
	// Toast
	// Redirect

	return <Login />
}

export default Page
