import { getAllPosts } from "@/utils/FetchAPI"
import DiscoverPost from "./DiscoverPost"

const Page = async () => {
	const postData = await getAllPosts(1)

	return <DiscoverPost post={postData} />
}

export default Page
