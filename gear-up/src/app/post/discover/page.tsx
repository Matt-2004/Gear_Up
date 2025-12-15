import DiscoverPost from "./DiscoverPost"
import { getPostData } from "./helper"

const Page = async () => {
	const postData = await getPostData()

	return <DiscoverPost post={postData} />
}

export default Page
