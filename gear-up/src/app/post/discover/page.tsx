import { getAllPosts } from "@/utils/API/PostAPI"
import DiscoverPost from "./DiscoverPost"

const Page = async () => {
	const postResponse = await getAllPosts()

	return <DiscoverPost post={postResponse?.data} />
}

export default Page
