import { getAllPosts } from "@/utils/API/PostAPI"
import { getUserProfile } from "@/utils/API/UserAPI"
import DiscoverPost from "./DiscoverPost"

const Page = async () => {
	const postResponse = await getAllPosts()
	const userResponse = await getUserProfile()

	return <DiscoverPost post={postResponse?.data} user={userResponse?.data} />
}

export default Page
