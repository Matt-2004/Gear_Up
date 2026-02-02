import { getUserProfile } from "@/utils/API/UserAPI"
import ProfilePage from "./ProfilePage"

async function getData() {
	try {
		const res = await getUserProfile()
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
