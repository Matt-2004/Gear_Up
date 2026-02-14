
import { DEFAULT_API_URL } from "@/lib/config"
import axios from "axios"
import { Metadata } from "next"
import { cookies } from "next/headers"
import ProfilePage from "./ProfilePage"

export const metadata: Metadata = {
	title: "My Profile - Gear Up",
	description: "View and manage your Gear Up profile and settings.",
}

async function getData() {
	const access_token = (await cookies()).get("access_token")?.value

	if (!access_token) {
		throw new Error("Access token not found")
	}
	try {
		const res = await axios.get(`${DEFAULT_API_URL}/api/user`, {
			headers: {
				Cookie: `access_token=${access_token}`
			}
		})
		console.log("Fetched user profile data:", res.data)
		return res?.data
	} catch (error) {
		console.error("Error fetching user profile:", error)
		throw error
	}
}

const Page = async () => {
	const data = await getData()
	return (
		<>
			<ProfilePage data={data} />
		</>
	)
}

export default Page
