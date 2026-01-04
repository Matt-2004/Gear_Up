import { getAllPosts, getUserProfile } from "@/utils/FetchAPI"
import DiscoverPost from "./DiscoverPost"

const Page = async () => {
	const postData = await getAllPosts(1)
	const user = await getUserProfile()

	return <DiscoverPost post={postData} user={user} />
}

export default Page
